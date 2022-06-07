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
package org.thingsboard.server.common.data.alarm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.thingsboard.server.common.data.BaseData;
import org.thingsboard.server.common.data.HasName;
import org.thingsboard.server.common.data.HasTenantId;
import org.thingsboard.server.common.data.id.AlarmId;
import org.thingsboard.server.common.data.id.EntityId;
import org.thingsboard.server.common.data.id.TenantId;

import java.util.List;

/**
 * Created by ashvayka on 11.05.17.
 */
@Data
@Builder
@AllArgsConstructor
public class Alarm extends BaseData<AlarmId> implements HasName, HasTenantId {
    //租户id
    private TenantId tenantId;
    //警告类型
    private String type;
    //实体id
    private EntityId originator;
    //警告安全级别
    private AlarmSeverity severity;
    //警告状态
    private AlarmStatus status;
    //警告开始时间
    private long startTs;
    //警告结束时间
    private long endTs;
    //警告回应时间
    private long ackTs;
    //警告清楚时间
    private long clearTs;
    private transient JsonNode details;
    private boolean propagate;
    private List<String> propagateRelationTypes;

    public Alarm() {
        super();
    }

    public Alarm(AlarmId id) {
        super(id);
    }

    public Alarm(Alarm alarm) {
        super(alarm.getId());
        this.createdTime = alarm.getCreatedTime();
        this.tenantId = alarm.getTenantId();
        this.type = alarm.getType();
        this.originator = alarm.getOriginator();
        this.severity = alarm.getSeverity();
        this.status = alarm.getStatus();
        this.startTs = alarm.getStartTs();
        this.endTs = alarm.getEndTs();
        this.ackTs = alarm.getAckTs();
        this.clearTs = alarm.getClearTs();
        this.details = alarm.getDetails();
        this.propagate = alarm.isPropagate();
        this.propagateRelationTypes = alarm.getPropagateRelationTypes();
    }

    @Override
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getName() {
        return type;
    }
}
