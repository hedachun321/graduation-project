///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../core.state';
import { selectAuthUser, selectIsAuthenticated } from '../auth/auth.selectors';
import { take } from 'rxjs/operators';
import { HomeSection, MenuSection } from '@core/services/menu.models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Authority } from '@shared/models/authority.enum';
import { AuthUser } from '@shared/models/user.model';
import { guid } from '@core/utils';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuSections$: Subject<Array<MenuSection>> = new BehaviorSubject<Array<MenuSection>>([]);
  homeSections$: Subject<Array<HomeSection>> = new BehaviorSubject<Array<HomeSection>>([]);
  //菜单构造器
  constructor(private store: Store<AppState>, private authService: AuthService) {
    this.store.pipe(select(selectIsAuthenticated)).subscribe(
      (authenticated: boolean) => {
        //如果认证用户成功！
        if (authenticated) {
          //构造菜单
          this.buildMenu();
        }
      }
    );
  }
  //初始化菜单
  private buildMenu() {
    this.store.pipe(select(selectAuthUser), take(1)).subscribe(
      (authUser: AuthUser) => {
        if (authUser) {
          //定义菜单数组
          let menuSections: Array<MenuSection>;
          //定义主页数组
          let homeSections: Array<HomeSection>;
          switch (authUser.authority) {
            //初始化管理员菜单
            case Authority.SYS_ADMIN:
              //获取初始化管理员菜单
              menuSections = this.buildSysAdminMenu(authUser);
              //获取初始化主页菜单
              homeSections = this.buildSysAdminHome(authUser);
              break;
            //初始化租户菜单
            case Authority.TENANT_ADMIN:
              //获取初始化租户菜单
              menuSections = this.buildTenantAdminMenu(authUser);
              //获取初始化租户主页
              homeSections = this.buildTenantAdminHome(authUser);
              break;
            //初始化客户菜单
            case Authority.CUSTOMER_USER:
              //获取初始化客户菜单
              menuSections = this.buildCustomerUserMenu(authUser);
              //获取初始化客户主页
              homeSections = this.buildCustomerUserHome(authUser);
              break;
          }
          //赋值
          this.menuSections$.next(menuSections);
          this.homeSections$.next(homeSections);
        }
      }
    );
  }

  private buildSysAdminMenu(authUser: any): Array<MenuSection> {
    const sections: Array<MenuSection> = [];
    sections.push(
      {
        id: guid(),
        name: 'home.home',
        type: 'link',
        path: '/home',
        icon: 'home'
      },
      {
        id: guid(),
        name: 'tenant.tenants',
        type: 'link',
        path: '/tenants',
        icon: 'supervisor_account'
      },
      {
        id: guid(),
        name: 'tenant-profile.tenant-profiles',
        type: 'link',
        path: '/tenantProfiles',
        icon: 'mdi:alpha-t-box',
        isMdiIcon: true
      },
      {
        id: guid(),
        name: 'widget.widget-library',
        type: 'link',
        path: '/widgets-bundles',
        icon: 'now_widgets'
      },
      {
        id: guid(),
        name: 'admin.system-settings',
        type: 'toggle',
        path: '/settings',
        height: '200px',
        icon: 'settings',
        pages: [
          {
            id: guid(),
            name: 'admin.general',
            type: 'link',
            path: '/settings/general',
            icon: 'settings_applications'
          },
          {
            id: guid(),
            name: 'admin.outgoing-mail',
            type: 'link',
            path: '/settings/outgoing-mail',
            icon: 'mail'
          },
          {
            id: guid(),
            name: 'admin.sms-provider',
            type: 'link',
            path: '/settings/sms-provider',
            icon: 'sms'
          },
          {
            id: guid(),
            name: 'admin.security-settings',
            type: 'link',
            path: '/settings/security-settings',
            icon: 'security'
          },
          {
            id: guid(),
            name: 'admin.oauth2.oauth2',
            type: 'link',
            path: '/settings/oauth2',
            icon: 'security'
          }
        ]
      }
    );
    return sections;
  }

  private buildSysAdminHome(authUser: any): Array<HomeSection> {
    const homeSections: Array<HomeSection> = [];
    homeSections.push(
      {
        name: 'tenant.management',
        places: [
          {
            name: 'tenant.tenants',
            icon: 'supervisor_account',
            path: '/tenants'
          },
          {
            name: 'tenant-profile.tenant-profiles',
            icon: 'mdi:alpha-t-box',
            isMdiIcon: true,
            path: '/tenantProfiles'
          },
        ]
      },
      {
        name: 'widget.management',
        places: [
          {
            name: 'widget.widget-library',
            icon: 'now_widgets',
            path: '/widgets-bundles'
          }
        ]
      },
      {
        name: 'admin.system-settings',
        places: [
          {
            name: 'admin.general',
            icon: 'settings_applications',
            path: '/settings/general'
          },
          {
            name: 'admin.outgoing-mail',
            icon: 'mail',
            path: '/settings/outgoing-mail'
          },
          {
            name: 'admin.sms-provider',
            icon: 'sms',
            path: '/settings/sms-provider'
          },
          {
            name: 'admin.security-settings',
            icon: 'security',
            path: '/settings/security-settings'
          },
          {
            name: 'admin.oauth2.oauth2',
            icon: 'security',
            path: '/settings/oauth2'
          }
        ]
      }
    );
    return homeSections;
  }
  //初始化租户菜单
  private buildTenantAdminMenu(authUser: any): Array<MenuSection> {
    const sections: Array<MenuSection> = [];
    sections.push(
      //主页
      {
        id: guid(),
        name: 'home.home',
        type: 'link',
        path: '/home',
        notExact: true,
        icon: 'home'
      },
      //规则链
      {
        id: guid(),
        name: 'rulechain.rulechains',
        type: 'link',
        path: '/ruleChains',
        icon: 'settings_ethernet'
      },
      //客户
      {
        id: guid(),
        name: 'customer.customers',
        type: 'link',
        path: '/customers',
        icon: 'supervisor_account'
      },
      //资产
      {
        id: guid(),
        name: 'asset.assets',
        type: 'link',
        path: '/assets',
        icon: 'domain'
      },
      //设备
      {
        id: guid(),
        name: 'device.devices',
        type: 'link',
        path: '/devices',
        icon: 'devices_other'
      },
      //设备属性
      {
        id: guid(),
        name: 'device-profile.device-profiles',
        type: 'link',
        path: '/deviceProfiles',
        icon: 'mdi:alpha-d-box',
        isMdiIcon: true
      },
      //实体视图
/*      {
        id: guid(),
        name: 'entity-view.entity-views',
        type: 'link',
        path: '/entityViews',
        icon: 'view_quilt'
      },*/
      //部件库
      {
        id: guid(),
        name: 'widget.widget-library',
        type: 'link',
        path: '/widgets-bundles',
        icon: 'now_widgets'
      },
      //仪表盘
      {
        id: guid(),
        name: 'dashboard.dashboards',
        type: 'link',
        path: '/dashboards',
        icon: 'dashboards'
      },
      //主页设置
      {
        id: guid(),
        name: 'admin.home-settings',
        type: 'link',
        path: '/settings/home',
        icon: 'settings_applications'
      },
      //审计日志
/*      {
        id: guid(),
        name: 'audit-log.audit-logs',
        type: 'link',
        path: '/auditLogs',
        icon: 'track_changes'
      },*/
      //api使用情况
/*      {
        id: guid(),
        name: 'api-usage.api-usage',
        type: 'link',
        path: '/usage',
        icon: 'insert_chart',
        notExact: true
      }*/
    );
    return sections;
  }

  private buildTenantAdminHome(authUser: any): Array<HomeSection> {
    const homeSections: Array<HomeSection> = [];
    homeSections.push(
      {
        name: 'rulechain.management',
        places: [
          {
            name: 'rulechain.rulechains',
            icon: 'settings_ethernet',
            path: '/ruleChains'
          }
        ]
      },
      {
        name: 'customer.management',
        places: [
          {
            name: 'customer.customers',
            icon: 'supervisor_account',
            path: '/customers'
          }
        ]
      },
      {
        name: 'asset.management',
        places: [
          {
            name: 'asset.assets',
            icon: 'domain',
            path: '/assets'
          }
        ]
      },
      {
        name: 'device.management',
        places: [
          {
            name: 'device.devices',
            icon: 'devices_other',
            path: '/devices'
          },
          {
            name: 'device-profile.device-profiles',
            icon: 'mdi:alpha-d-box',
            isMdiIcon: true,
            path: '/deviceProfiles'
          }
        ]
      },
/*      {
        name: 'entity-view.management',
        places: [
          {
            name: 'entity-view.entity-views',
            icon: 'view_quilt',
            path: '/entityViews'
          }
        ]
      },*/
      {
        name: 'dashboard.management',
        places: [
          {
            name: 'widget.widget-library',
            icon: 'now_widgets',
            path: '/widgets-bundles'
          },
          {
            name: 'dashboard.dashboards',
            icon: 'dashboard',
            path: '/dashboards'
          }
        ]
      }/*,
      {
        name: 'audit-log.audit',
        places: [
          {
            name: 'audit-log.audit-logs',
            icon: 'track_changes',
            path: '/auditLogs'
          },
          {
            name: 'api-usage.api-usage',
            icon: 'insert_chart',
            path: '/usage'
          }
        ]
      }*/
    );
    return homeSections;
  }

  private buildCustomerUserMenu(authUser: any): Array<MenuSection> {
    const sections: Array<MenuSection> = [];
    sections.push(
      {
        id: guid(),
        name: 'home.home',
        type: 'link',
        path: '/home',
        notExact: true,
        icon: 'home'
      },
      {
        id: guid(),
        name: 'asset.assets',
        type: 'link',
        path: '/assets',
        icon: 'domain'
      },
      {
        id: guid(),
        name: 'device.devices',
        type: 'link',
        path: '/devices',
        icon: 'devices_other'
      },
      {
        id: guid(),
        name: 'entity-view.entity-views',
        type: 'link',
        path: '/entityViews',
        icon: 'view_quilt'
      },
      {
        id: guid(),
        name: 'dashboard.dashboards',
        type: 'link',
        path: '/dashboards',
        icon: 'dashboard'
      }
    );
    return sections;
  }

  private buildCustomerUserHome(authUser: any): Array<HomeSection> {
    const homeSections: Array<HomeSection> = [
      {
        name: 'asset.view-assets',
        places: [
          {
            name: 'asset.assets',
            icon: 'domain',
            path: '/assets'
          }
        ]
      },
      {
        name: 'device.view-devices',
        places: [
          {
            name: 'device.devices',
            icon: 'devices_other',
            path: '/devices'
          }
        ]
      },
      {
        name: 'entity-view.management',
        places: [
          {
            name: 'entity-view.entity-views',
            icon: 'view_quilt',
            path: '/entityViews'
          }
        ]
      },
      {
        name: 'dashboard.view-dashboards',
        places: [
          {
            name: 'dashboard.dashboards',
            icon: 'dashboard',
            path: '/dashboards'
          }
        ]
      }
    ];
    return homeSections;
  }

  public menuSections(): Observable<Array<MenuSection>> {
    return this.menuSections$;
  }

  public homeSections(): Observable<Array<HomeSection>> {
    return this.homeSections$;
  }

}

