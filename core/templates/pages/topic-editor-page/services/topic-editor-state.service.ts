// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Service to maintain the state of a single topic shared
 * throughout the topic editor. This service provides functionality for
 * retrieving the topic, saving it, and listening for changes.
 */


import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { UndoRedoService } from 'domain/editor/undo_redo/undo-redo.service.ts';
import { StorySummary, StorySummaryBackendDict } from 'domain/story/story-summary.model';
import { TopicRights } from 'domain/topic/topic-rights.model';
import { SubtopicPageObjectFactory, SubtopicPage, SubtopicPageBackendDict } from 'domain/topic/SubtopicPageObjectFactory.ts';
import { TopicObjectFactory, Topic, TopicBackendDict } from 'domain/topic/TopicObjectFactory.ts';
import { TopicRightsBackendApiService } from 'domain/topic/topic-rights-backend-api.service.ts';
import { EditableStoryBackendApiService } from 'domain/story/editable-story-backend-api.service.ts';
import { RubricObjectFactory, RubricBackendDict, Rubric } from 'domain/skill/RubricObjectFactory.ts';
import { EditableTopicBackendApiService } from 'domain/topic/editable-topic-backend-api.service.ts';
import cloneDeep from 'lodash/cloneDeep';
import { AlertsService } from 'services/alerts.service';
import { SkillSummaryBackendDict } from 'domain/skill/skill-summary.model';
import { SkillIdToDescriptionMap } from 'domain/topic/SubtopicObjectFactory';

@Injectable({
  providedIn: 'root'
})
export class TopicEditorStateService {
  constructor(
    private alertService: AlertsService,
    private editableStoryBackendApiService: EditableStoryBackendApiService,
    private editableTopicBackendApiService: EditableTopicBackendApiService,
    private rubricObjectFactory: RubricObjectFactory,
    private subtopicPageObjectFactory: SubtopicPageObjectFactory,
    private topicObjectFactory: TopicObjectFactory,
    private topicRightsBackendApiService: TopicRightsBackendApiService,
    private undoRedoService: UndoRedoService) {}

  private _topic: Topic = this.topicObjectFactory.createInterstitialTopic();
  private _topicRights: TopicRights = TopicRights.createInterstitialRights();
  // The array that caches all the subtopic pages loaded by the user.
  private _cachedSubtopicPages: SubtopicPage[] = [];
  // The array that stores all the ids of the subtopic pages that were not
  // loaded from the backend i.e those that correspond to newly created
  // subtopics (and not loaded from the backend).
  private _newSubtopicPageIds: string[] = [];
  private _subtopicPage: SubtopicPage =
  this.subtopicPageObjectFactory.createInterstitialSubtopicPage();
  private _topicIsInitialized: boolean = false;
  private _topicIsLoading: boolean = false;
  private _skillCreationIsAllowed = false;
  private _topicIsBeingSaved: boolean = false;
  private _topicWithNameExists: boolean = false;
  private _topicWithUrlFragmentExists: boolean = false;
  private _canonicalStorySummaries: StorySummary[] = [];
  private _skillIdToRubricsObject: Record<string, Rubric[]> = {} ;
  private _skillQuestionCountDict:
  { [skillId: string]: number; } | undefined[] = {};
  private _groupedSkillSummaries = {
    current: [],
    others: []
  };
  private _classroomUrlFragment = 'staging';
  private _storySummariesInitializedEventEmitter = new EventEmitter();
  private _subtopicPageLoadedEventEmitter: EventEmitter<void> =
   new EventEmitter();
  private _topicInitializedEventEmitter: EventEmitter<void> =
   new EventEmitter();
  private _topicReinitializedEventEmitter: EventEmitter<void> =
   new EventEmitter();

  private _getSubtopicPageId(topicId: string, subtopicId: number):string {
    return topicId + '-' + subtopicId.toString();
  }

  private _updateGroupedSkillSummaries(
      groupedSkillSummaries:{[topicName: string]: SkillSummaryBackendDict[]})
    : void {
    this._groupedSkillSummaries.current = [];
    this._groupedSkillSummaries.others = [];

    for (let idx in groupedSkillSummaries[this._topic.getName()]) {
      this._groupedSkillSummaries.current.push(
        groupedSkillSummaries[this._topic.getName()][idx]);
    }
    for (let name in groupedSkillSummaries) {
      if (name === this._topic.getName()) {
        continue;
      }
      let skillSummaries = groupedSkillSummaries[name];
      for (let idx in skillSummaries) {
        this._groupedSkillSummaries.others.push(skillSummaries[idx]);
      }
    }
  }
  private _getSubtopicIdFromSubtopicPageId(subtopicPageId: string): number {
    // The subtopic page id consists of the topic id of length 12, a hyphen
    // and a subtopic id (which is a number).
    return parseInt(subtopicPageId.slice(13));
  }
  private _setTopic(topic: Topic): void {
    this._topic.copyFromTopic(topic);
    // Reset the subtopic pages list after setting new topic.
    this._cachedSubtopicPages.length = 0;
    if (this._topicIsInitialized) {
      this._topicIsInitialized = true;
      this._topicReinitializedEventEmitter.emit();
    } else {
      this._topicIsInitialized = true;
      this._topicInitializedEventEmitter.emit();
    }
  }
  private _getSubtopicPageIndex(subtopicPageId: string): number|null {
    for (let i = 0; i < this._cachedSubtopicPages.length; i++) {
      if (this._cachedSubtopicPages[i].getId() === subtopicPageId) {
        return i;
      }
    }
    return null;
  }
  _updateClassroomUrlFragment(classroomUrlFragment: string): void {
    this._classroomUrlFragment = classroomUrlFragment;
  }
  _updateTopic(
      newBackendTopicDict: TopicBackendDict,
      skillIdToDescriptionDict: SkillIdToDescriptionMap): void {
    this._setTopic(
      this.topicObjectFactory.create(
        newBackendTopicDict, skillIdToDescriptionDict));
  }
  private _updateSkillIdToRubricsObject(
      skillIdToRubricsObject:
      {[skillId: string]: RubricBackendDict[]}): void {
    for (let skillId in skillIdToRubricsObject) {
      let rubrics = skillIdToRubricsObject[skillId].map((
          rubric) => {
        return this.rubricObjectFactory.createFromBackendDict(rubric);
      });
      this._skillIdToRubricsObject[skillId] = rubrics;
    }
  }
  private _setSubtopicPage(subtopicPage: SubtopicPage): void {
    this._subtopicPage.copyFromSubtopicPage(subtopicPage);
    this._cachedSubtopicPages.push(cloneDeep(subtopicPage));
    this._subtopicPageLoadedEventEmitter.emit();
  }
  private _updateSubtopicPage(
      newBackendSubtopicPageObject: SubtopicPageBackendDict): void {
    this._setSubtopicPage(this.subtopicPageObjectFactory.createFromBackendDict(
      newBackendSubtopicPageObject));
  }
  private _setTopicRights(topicRights: TopicRights): void {
    this._topicRights.copyFromTopicRights(topicRights);
  }
  private _updateTopicRights(
      newBackendTopicRightsObject): void {
    this._setTopicRights(TopicRights.createFromBackendDict(
      newBackendTopicRightsObject));
  }
  private _setCanonicalStorySummaries(
      canonicalStorySummaries: StorySummaryBackendDict[]): void {
    this._canonicalStorySummaries = canonicalStorySummaries.map(
      (storySummaryDict) => {
        return StorySummary.createFromBackendDict(
          storySummaryDict);
      });
    this._storySummariesInitializedEventEmitter.emit();
  }

  private _setTopicWithNameExists(topicWithNameExists: boolean): void {
    this._topicWithNameExists = topicWithNameExists;
  }

  private _setTopicWithUrlFragmentExists(
      topicWithUrlFragmentExists: boolean): void {
    this._topicWithUrlFragmentExists = topicWithUrlFragmentExists;
  }

  /**
   * Loads, or reloads, the topic stored by this service given a
   * specified topic ID. See setTopic() for more information on
   * additional behavior of this function.
   */
  loadTopic(topicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._topicIsLoading = true;
      this.editableTopicBackendApiService.fetchTopic(
        topicId).then(
        (newBackendTopicObject) => {
          this._skillCreationIsAllowed = (
            newBackendTopicObject.skillCreationIsAllowed);
          this._skillQuestionCountDict = (
            newBackendTopicObject.skillQuestionCountDict);
          this._updateGroupedSkillSummaries(
            newBackendTopicObject.groupedSkillSummaries);
          this._updateTopic(
            newBackendTopicObject.topicDict,
            newBackendTopicObject.skillIdToDescriptionDict
          );
          this._updateGroupedSkillSummaries(
            newBackendTopicObject.groupedSkillSummaries);
          this._updateSkillIdToRubricsObject(
            newBackendTopicObject.skillIdToRubricsDict);
          this._updateClassroomUrlFragment(
            newBackendTopicObject.classroomUrlFragment);
          this.editableTopicBackendApiService.fetchStories(topicId).then(
            (canonicalStorySummaries) => {
              this._setCanonicalStorySummaries(canonicalStorySummaries);
            });
        },
        (error) => {
          this.alertService.addWarning(
            error || 'There was an error when loading the topic.');
          this._topicIsLoading = false;
          reject();
        });
      this.topicRightsBackendApiService.fetchTopicRights(
        topicId).then((newBackendTopicRightsObject) => {
        this._updateTopicRights(newBackendTopicRightsObject);
        this._topicIsLoading = false;
        resolve();
      }, (error) => {
        this.alertService.addWarning(
          error ||
            'There was an error when loading the topic rights.');
        this._topicIsLoading = false;
        reject();
      });
    });
  }

  getGroupedSkillSummaries(): { current: unknown[]; others: unknown[]; } {
    return cloneDeep(this._groupedSkillSummaries);
  }

  getSkillQuestionCountDict(): { [skillId: string]: number; } | undefined[] {
    return this._skillQuestionCountDict;
  }

  /**
   * Returns whether the topic name already exists on the server.
   */
  getTopicWithNameExists(): boolean {
    return this._topicWithNameExists;
  }

  /**
   * Returns whether the topic URL fragment already exists on the server.
   */
  getTopicWithUrlFragmentExists(): boolean {
    return this._topicWithUrlFragmentExists;
  }

  /**
   * Loads, or reloads, the subtopic page stored by this service given a
   * specified topic ID and subtopic ID.
   */
  loadSubtopicPage(topicId: string, subtopicId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let subtopicPageId = this._getSubtopicPageId(topicId, subtopicId);
      if (this._getSubtopicPageIndex(subtopicPageId) !== null) {
        this._subtopicPage = cloneDeep(
          this._cachedSubtopicPages[
            this._getSubtopicPageIndex(subtopicPageId)]);
        this._subtopicPageLoadedEventEmitter.emit();
        return;
      }
      this.editableTopicBackendApiService.fetchSubtopicPage(
        topicId, subtopicId).then(
        (newBackendSubtopicPageObject) => {
          this._updateSubtopicPage(newBackendSubtopicPageObject);
          resolve();
        },
        (error) => {
          this.alertService.addWarning(
            error || 'There was an error when loading the topic.');
          reject();
        });
    });
  }

  /**
   * Returns whether this service is currently attempting to load the
   * topic maintained by this service.
   */
  isLoadingTopic(): boolean {
    return this._topicIsLoading;
  }

  /**
   * Returns whether a topic has yet been loaded using either
   * loadTopic() or setTopic().
   */
  hasLoadedTopic(): boolean {
    return this._topicIsInitialized;
  }

  getSkillIdToRubricsObject(): Record<string, Rubric[]> {
    return this._skillIdToRubricsObject;
  }

  /**
   * Returns the current topic to be shared among the topic
   * editor. Please note any changes to this topic will be propogated
   * to all bindings to it. This topic object will be retained for the
   * lifetime of the editor. This function never returns null, though it may
   * return an empty topic object if the topic has not yet been
   * loaded for this editor instance.
   */
  getTopic(): Topic {
    return this._topic;
  }

  getCanonicalStorySummaries(): StorySummary[] {
    return this._canonicalStorySummaries;
  }
  /**
   * Returns whether the user can create a skill via the topic editor.
   */
  isSkillCreationAllowed() : boolean {
    return this._skillCreationIsAllowed;
  }

  /**
   * Returns the current subtopic page to be shared among the topic
   * editor. Please note any changes to this subtopic page will be
   * propogated to all bindings to it. This subtopic page object will be
   * retained for the lifetime of the editor. This function never returns
   * null, though it may return an empty subtopic page object if the topic
   * has not yet been loaded for this editor instance.
   */
  getSubtopicPage(): SubtopicPage {
    return this._subtopicPage;
  }

  getCachedSubtopicPages(): SubtopicPage[] {
    return this._cachedSubtopicPages;
  }

  /**
   * Returns the current topic rights to be shared among the topic
   * editor. Please note any changes to this topic rights will be
   * propogated to all bindings to it. This topic rights object will
   * be retained for the lifetime of the editor. This function never returns
   * null, though it may return an empty topic rights object if the
   * topic rights has not yet been loaded for this editor instance.
   */
  getTopicRights(): TopicRights {
    return this._topicRights;
  }


  /**
   * Sets the topic stored within this service, propogating changes to
   * all bindings to the topic returned by getTopic(). The first
   * time this is called it will fire a global event based on
   * onTopicInitialized. All subsequent
   * calls will similarly fire a onTopicReinitialized event.
   */
  setTopic(topic: Topic): void {
    this._setTopic(topic);
  }

  /**
   * Sets the updated subtopic page object in the correct position in the
   * _cachedSubtopicPages list.
   */
  setSubtopicPage(subtopicPage: SubtopicPage): void {
    if (this._getSubtopicPageIndex(subtopicPage.getId()) !== null) {
      this._cachedSubtopicPages[
        this._getSubtopicPageIndex(subtopicPage.getId())] = cloneDeep(
        subtopicPage);
      this._subtopicPage.copyFromSubtopicPage(subtopicPage);
    } else {
      this._setSubtopicPage(subtopicPage);
      this._newSubtopicPageIds.push(subtopicPage.getId());
    }
  }

  deleteSubtopicPage(topicId: string, subtopicId: number): void {
    let subtopicPageId = this._getSubtopicPageId(topicId, subtopicId);
    let index = this._getSubtopicPageIndex(subtopicPageId);
    let newIndex = this._newSubtopicPageIds.indexOf(subtopicPageId);
    // If index is null, that means the corresponding subtopic page was
    // never loaded from the backend and not that the subtopic page doesn't
    // exist at all. So, not required to throw an error here.
    // Also, since newSubtopicPageIds will only have the ids of a subset of
    // the pages in the _subtopicPages array, the former need not be edited
    // either, in this case.
    if (index === null) {
      if (newIndex === -1) {
        return;
      }
    }
    this._cachedSubtopicPages.splice(index, 1);
    // If the deleted subtopic page corresponded to a newly created
    // subtopic, then the 'subtopicId' part of the id of all subsequent
    // subtopic pages should be decremented to make it in sync with the
    // their corresponding subtopic ids.
    if (newIndex !== -1) {
      this._newSubtopicPageIds.splice(newIndex, 1);
      for (let i = 0; i < this._cachedSubtopicPages.length; i++) {
        let newSubtopicId = this._getSubtopicIdFromSubtopicPageId(
          this._cachedSubtopicPages[i].getId());
        if (newSubtopicId > subtopicId) {
          newSubtopicId--;
          this._cachedSubtopicPages[i].setId(
            this._getSubtopicPageId(topicId, newSubtopicId));
        }
      }
      for (let i = 0; i < this._newSubtopicPageIds.length; i++) {
        let newSubtopicId = this._getSubtopicIdFromSubtopicPageId(
          this._newSubtopicPageIds[i]);
        if (newSubtopicId > subtopicId) {
          newSubtopicId--;
          this._newSubtopicPageIds[i] = this._getSubtopicPageId(
            topicId, newSubtopicId);
        }
      }
    }
  }

  /**
       * Sets the topic rights stored within this service, propogating
       * changes to all bindings to the topic returned by
       * getTopicRights().
       */
  setTopicRights(topicRights: TopicRights): void {
    this._setTopicRights(topicRights);
  }


  /**
   * Attempts to save the current topic given a commit message. This
   * function cannot be called until after a topic has been initialized
   * in this service. Returns false if a save is not performed due to no
   * changes pending, or true if otherwise. This function, upon success,
   * will clear the UndoRedoService of pending changes. This function also
   * shares behavior with setTopic(), when it succeeds.
   */
  saveTopic(
      commitMessage: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._topicIsInitialized) {
        this.alertService.fatalWarning(
          'Cannot save a topic before one is loaded.');
        reject();
      }

      // Don't attempt to save the topic if there are no changes pending.
      if (!this.undoRedoService.hasChanges()) {
        reject();
      }
      this._topicIsBeingSaved = true;
      this.editableTopicBackendApiService.updateTopic(
        this._topic.getId(), this._topic.getVersion(),
        commitMessage, this.undoRedoService.getCommittableChangeList()).then(
        (topicBackendObject) => {
          this._updateTopic(
            topicBackendObject.topicDict,
            topicBackendObject.skillIdToDescriptionDict
          );
          this._updateSkillIdToRubricsObject(
            topicBackendObject.skillIdToRubricsDict);
          let changeList =
         this.undoRedoService.getCommittableChangeList();
          for (let change of changeList) {
            if ((change.cmd === 'delete_canonical_story' ||
                  change.cmd === 'delete_additional_story') &&
                  'story_id' in change) {
              this.editableStoryBackendApiService.deleteStory(
                change.story_id);
            }
          }
          this.undoRedoService.clearChanges();
          this._topicIsBeingSaved = false;
          resolve();
        }, (error: string) => {
          this.alertService.addWarning(
            error || 'There was an error when saving the topic.');
          this._topicIsBeingSaved = false;
        });
    });
  }

  /**
   * Returns whether this service is currently attempting to save the
   * topic maintained by this service.
   */
  isSavingTopic(): boolean {
    return this._topicIsBeingSaved;
  }

  get onTopicInitialized(): EventEmitter<void> {
    return this._topicInitializedEventEmitter;
  }

  get onTopicReinitialized(): EventEmitter<void> {
    return this._topicReinitializedEventEmitter;
  }
  /**
       * Returns the classroom name for the topic.
       */
  getClassroomUrlFragment(): string {
    return this._classroomUrlFragment;
  }

  /**
   * Attempts to set the boolean variable _topicWithNameExists based
   * on the value returned by doesTopicWithNameExistAsync and
   * resolves it.
   */
  updateExistenceOfTopicName(
      topicName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.editableTopicBackendApiService.doesTopicWithNameExistAsync(
        topicName).then(
        (topicNameExists) => {
          this._setTopicWithNameExists(topicNameExists);
          resolve();
        }, (error) => {
          this.alertService.addWarning(
            error ||
              'There was an error when checking if the topic name ' +
              'exists for another topic.');
          reject();
        });
    });
  }

  /**
   * Attempts to set the boolean variable _topicWithUrlFragmentExists based
   * on the value returned by doesTopicWithUrlFragmentExistAsync and
   * resolves it.
   */
  updateExistenceOfTopicUrlFragment(
      topicUrlFragment: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.editableTopicBackendApiService.
        doesTopicWithUrlFragmentExistAsync(
          topicUrlFragment).then(
          (topicUrlFragmentExists) => {
            this._setTopicWithUrlFragmentExists(topicUrlFragmentExists);
            resolve();
          }, (error) => {
            this.alertService.addWarning(
              error ||
              'There was an error when checking if the topic url fragment ' +
              'exists for another topic.');
            reject();
          });
    });
  }

  get onStorySummariesInitialized(): EventEmitter<void> {
    return this._storySummariesInitializedEventEmitter;
  }

  get onSubtopicPageLoaded(): EventEmitter<void> {
    return this._subtopicPageLoadedEventEmitter;
  }
}

angular.module('oppia').factory(
  'TopicEditorStateService', downgradeInjectable(TopicEditorStateService));
