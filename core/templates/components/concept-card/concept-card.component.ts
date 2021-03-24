// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the concept cards viewer.
 */

import { Component, Input, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { ConceptCardBackendApiService } from 'domain/skill/concept-card-backend-api.service';
import { ConceptCard } from 'domain/skill/ConceptCardObjectFactory';


@Component({
  selector: 'concept-card',
  templateUrl: './concept-card.template.html'
})
export class ConceptCardComponent implements OnInit {
  numberOfWorkedExamplesShown: number = 0;
  currentConceptCard: ConceptCard;
  explanationIsShown: boolean = false;
  conceptCards: ConceptCard[];
  loadingMessage: string = '';
  @Input() skillIds: string[];
  @Input() index;
  constructor(
  private conceptCardBackendApiService : ConceptCardBackendApiService
  ) {}

  isLastWorkedExample(): boolean {
    return this.numberOfWorkedExamplesShown ===
      this.currentConceptCard.getWorkedExamples().length;
  }
  showMoreWorkedExamples(): void {
    this.explanationIsShown = false;
    this.numberOfWorkedExamplesShown++;
  }

  ngOnInit(): void {
    this.conceptCards = [];
    this.currentConceptCard = null;
    this.numberOfWorkedExamplesShown = 0;
    this.loadingMessage = 'Loading';

    this.currentConceptCard = this.conceptCards[this.index];
    if (this.currentConceptCard) {
      this.numberOfWorkedExamplesShown = 0;
      if (this.currentConceptCard.getWorkedExamples().length > 0) {
        this.numberOfWorkedExamplesShown = 1;
      }
    }

    this.conceptCardBackendApiService.loadConceptCardsAsync(
      this.skillIds
    ).then(function(conceptCardObjects) {
      conceptCardObjects.forEach(function(conceptCardObject) {
        this.conceptCards.push(conceptCardObject);
      });
      this.loadingMessage = '';
      this.currentConceptCard = this.conceptCards[this.index];
      this.numberOfWorkedExamplesShown = 0;
      if (this.currentConceptCard.getWorkedExamples().length > 0) {
        this.numberOfWorkedExamplesShown = 1;
      }
    });
  }
}
angular.module('oppia').directive(
  'conceptCard', downgradeComponent(
    {component: ConceptCardComponent}));
