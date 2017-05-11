/*
 * Copyright (C) 2014-2015 Taiga Agile LLC <taiga@taiga.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: discover-home.controller.coffee
 */

import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {go} from "@ngrx/router-store";
import {Store} from "@ngrx/store";
import {TranslateService} from "@ngx-translate/core";
import {IState} from "../../../app.store";
import {NavigationUrlsService} from "../../../ts/modules/base/navurls.service";
import {AppMetaService} from "../../services/app-meta.service";
import * as actions from "../discover.actions";

@Component({
    selector: "tg-discover-home",
    template: require("./discover-home.pug")(),
})
export class DiscoverHome implements OnInit {
    title: string;
    description: string;
    mostLikedProjects: any;
    mostActiveProjects: any;
    featuredProjects: any;
    projectsCount: any;

    constructor(private store: Store<IState>,
                private router: Router,
                private navUrls: NavigationUrlsService,
                private appMetaService: AppMetaService,
                private translate: TranslateService) {
        const title = this.translate.instant("DISCOVER.PAGE_TITLE");
        const description = this.translate.instant("DISCOVER.PAGE_DESCRIPTION");
        this.appMetaService.setAll(title, description);

        this.mostLikedProjects = this.store.select((state) => state.getIn(["discover", "most-liked"]));
        this.mostActiveProjects = this.store.select((state) => state.getIn(["discover", "most-active"]));
        this.featuredProjects = this.store.select((state) => state.getIn(["discover", "featured"]));
        this.projectsCount = this.store.select((state) => state.getIn(["discover", "projects-count"]));
    }

    ngOnInit() {
        this.store.dispatch(new actions.FetchMostActiveAction("last_week"));
        this.store.dispatch(new actions.FetchMostLikedAction("last_week"));
        this.store.dispatch(new actions.FetchProjectsStatsAction());
        this.store.dispatch(new actions.FetchFeaturedProjectsAction());
    }

    onMostActiveOrder(newOrder) {
        this.store.dispatch(new actions.FetchMostActiveAction(`last_${newOrder}`));
    }

    onMostLikedOrder(newOrder) {
        this.store.dispatch(new actions.FetchMostLikedAction(`last_${newOrder}`));
    }

    onSearch(searchData) {
        return this.store.dispatch(go(["/discover", "search"], {text: searchData.q}));
    }
}