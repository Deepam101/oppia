// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Controller for question suggestion review modal.
 */

require(
  'pages/contributor-dashboard-page/services/' +
  'contribution-opportunities.service.ts');
require('services/site-analytics.service.ts');
require('services/suggestion-modal.service.ts');

angular.module('oppia').controller('QuestionSuggestionReviewModalController', [
  '$scope', '$uibModalInstance', 'ContributionOpportunitiesService',
  'SiteAnalyticsService', 'SuggestionModalService', 'authorName', 'contentHtml',
  'misconceptionsBySkill', 'question', 'questionHeader', 'reviewable',
  'skillDifficulty', 'skillRubrics', 'suggestionId', 'ACTION_ACCEPT_SUGGESTION',
  'ACTION_REJECT_SUGGESTION', 'SKILL_DIFFICULTY_LABEL_TO_FLOAT',
  function(
      $scope, $uibModalInstance, ContributionOpportunitiesService,
      SiteAnalyticsService, SuggestionModalService, authorName, contentHtml,
      misconceptionsBySkill, question, questionHeader, reviewable,
      skillDifficulty, skillRubrics, suggestionId, ACTION_ACCEPT_SUGGESTION,
      ACTION_REJECT_SUGGESTION, SKILL_DIFFICULTY_LABEL_TO_FLOAT) {
    const getSkillDifficultyLabel = () => {
      const skillDifficultyFloatToLabel = invertMap(
        SKILL_DIFFICULTY_LABEL_TO_FLOAT);
      return skillDifficultyFloatToLabel[skillDifficulty];
    };

    const getRubricExplanation = skillDifficultyLabel => {
      for (const rubric of skillRubrics) {
        if (rubric.difficulty === skillDifficultyLabel) {
          return rubric.explanations;
        }
      }
      return 'This rubric has not yet been specified.';
    };

    const invertMap = originalMap => {
      return Object.keys(originalMap).reduce(
        (invertedMap, key) => {
          invertedMap[originalMap[key]] = key;
          return invertedMap;
        },
        {}
      );
    };

    $scope.authorName = authorName;
    $scope.contentHtml = contentHtml;
    $scope.reviewable = reviewable;
    $scope.reviewMessage = '';
    $scope.question = question;
    $scope.questionHeader = questionHeader;
    $scope.questionStateData = question.getStateData();
    $scope.questionId = question.getId();
    $scope.canEditQuestion = false;
    $scope.misconceptionsBySkill = misconceptionsBySkill;
    $scope.skillDifficultyLabel = getSkillDifficultyLabel();
    $scope.skillRubricExplanations = getRubricExplanation(
      $scope.skillDifficultyLabel);

    if (reviewable) {
      SiteAnalyticsService.registerContributorDashboardViewSuggestionForReview(
        'Question');
    }

    $scope.questionChanged = function() {
      $scope.validationError = null;
    };

    $scope.accept = function() {
      ContributionOpportunitiesService.removeOpportunitiesEventEmitter.emit(
        [suggestionId]);
      SiteAnalyticsService.registerContributorDashboardAcceptSuggestion(
        'Question');
      SuggestionModalService.acceptSuggestion(
        $uibModalInstance,
        {
          action: ACTION_ACCEPT_SUGGESTION,
          reviewMessage: $scope.reviewMessage,
          skillDifficulty: skillDifficulty
        });
    };

    $scope.reject = function() {
      ContributionOpportunitiesService.removeOpportunitiesEventEmitter.emit(
        [suggestionId]);
      SiteAnalyticsService.registerContributorDashboardRejectSuggestion(
        'Question');
      SuggestionModalService.rejectSuggestion(
        $uibModalInstance,
        {
          action: ACTION_REJECT_SUGGESTION,
          reviewMessage: $scope.reviewMessage
        });
    };

    $scope.cancel = function() {
      SuggestionModalService.cancelSuggestion($uibModalInstance);
    };
  }
]);
