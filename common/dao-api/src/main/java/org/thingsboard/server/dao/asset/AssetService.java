/**
 * Copyright © 2016-2021 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.thingsboard.server.dao.asset;

import com.google.common.util.concurrent.ListenableFuture;
import org.thingsboard.server.common.data.EntitySubtype;
import org.thingsboard.server.common.data.asset.Asset;
import org.thingsboard.server.common.data.asset.AssetInfo;
import org.thingsboard.server.common.data.asset.AssetSearchQuery;
import org.thingsboard.server.common.data.id.AssetId;
import org.thingsboard.server.common.data.id.CustomerId;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;

import java.util.List;
import java.util.Optional;

public interface AssetService {
    //查找资产信息通过id
    AssetInfo findAssetInfoById(TenantId tenantId, AssetId assetId);
    //查找资产通过id
    Asset findAssetById(TenantId tenantId, AssetId assetId);

    ListenableFuture<Asset> findAssetByIdAsync(TenantId tenantId, AssetId assetId);
    //查找资产通过租户id和名字
    Asset findAssetByTenantIdAndName(TenantId tenantId, String name);
    //保存资产
    Asset saveAsset(Asset asset);
    //分配资产给客户
    Asset assignAssetToCustomer(TenantId tenantId, AssetId assetId, CustomerId customerId);
    //取消分配资产给客户
    Asset unassignAssetFromCustomer(TenantId tenantId, AssetId assetId);
    //删除资产
    void deleteAsset(TenantId tenantId, AssetId assetId);
    //分页数据
    PageData<Asset> findAssetsByTenantId(TenantId tenantId, PageLink pageLink);
    //资产信息分页
    PageData<AssetInfo> findAssetInfosByTenantId(TenantId tenantId, PageLink pageLink);
    //查找资产通过租户id和资产类型
    PageData<Asset> findAssetsByTenantIdAndType(TenantId tenantId, String type, PageLink pageLink);
    //查找资产信息通过租户id和类型
    PageData<AssetInfo> findAssetInfosByTenantIdAndType(TenantId tenantId, String type, PageLink pageLink);

    ListenableFuture<List<Asset>> findAssetsByTenantIdAndIdsAsync(TenantId tenantId, List<AssetId> assetIds);
    //删除资产通过租户id
    void deleteAssetsByTenantId(TenantId tenantId);
    //查找资产通过租户id和客户id
    PageData<Asset> findAssetsByTenantIdAndCustomerId(TenantId tenantId, CustomerId customerId, PageLink pageLink);
    //查找资产信息通过资产id和客户id
    PageData<AssetInfo> findAssetInfosByTenantIdAndCustomerId(TenantId tenantId, CustomerId customerId, PageLink pageLink);
    //查找资产通过租户id和客户id和类型
    PageData<Asset> findAssetsByTenantIdAndCustomerIdAndType(TenantId tenantId, CustomerId customerId, String type, PageLink pageLink);
    //
    PageData<AssetInfo> findAssetInfosByTenantIdAndCustomerIdAndType(TenantId tenantId, CustomerId customerId, String type, PageLink pageLink);

    ListenableFuture<List<Asset>> findAssetsByTenantIdCustomerIdAndIdsAsync(TenantId tenantId, CustomerId customerId, List<AssetId> assetIds);
    //取消资产分配给客户
    void unassignCustomerAssets(TenantId tenantId, CustomerId customerId);

    ListenableFuture<List<Asset>> findAssetsByQuery(TenantId tenantId, AssetSearchQuery query);

    ListenableFuture<List<EntitySubtype>> findAssetTypesByTenantId(TenantId tenantId);
}
