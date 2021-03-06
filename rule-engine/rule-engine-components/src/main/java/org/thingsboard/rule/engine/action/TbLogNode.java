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
package org.thingsboard.rule.engine.action;

import lombok.extern.slf4j.Slf4j;
import org.thingsboard.common.util.ListeningExecutor;
import org.thingsboard.rule.engine.api.util.TbNodeUtils;
import org.thingsboard.rule.engine.api.*;
import org.thingsboard.server.common.data.plugin.ComponentType;
import org.thingsboard.server.common.msg.TbMsg;

import static org.thingsboard.common.util.DonAsynchron.withCallback;
import static org.thingsboard.rule.engine.api.TbRelationTypes.SUCCESS;

@Slf4j
@RuleNode(
        type = ComponentType.ACTION,
        name = "日志",
        configClazz = TbLogNodeConfiguration.class,
        nodeDescription = "使用 JS 脚本记录传入消息以将消息转换为字符串",
        nodeDetails = "Transform incoming Message with configured JS function to String and log final value into Thingsboard log file. " +
                "Message payload can be accessed via <code>msg</code> property. For example <code>'temperature = ' + msg.temperature ;</code>. " +
                "Message metadata can be accessed via <code>metadata</code> property. For example <code>'name = ' + metadata.customerName;</code>.",
        uiResources = {"static/rulenode/rulenode-core-config.js"},
        configDirective = "tbActionNodeLogConfig",
        icon = "menu"
)

public class TbLogNode implements TbNode {

    private TbLogNodeConfiguration config;
    private ScriptEngine jsEngine;

    @Override
    public void init(TbContext ctx, TbNodeConfiguration configuration) throws TbNodeException {
        this.config = TbNodeUtils.convert(configuration, TbLogNodeConfiguration.class);
        this.jsEngine = ctx.createJsScriptEngine(config.getJsScript());
    }

    @Override
    public void onMsg(TbContext ctx, TbMsg msg) {
        ListeningExecutor jsExecutor = ctx.getJsExecutor();
        ctx.logJsEvalRequest();
        withCallback(jsExecutor.executeAsync(() -> jsEngine.executeToString(msg)),
                toString -> {
                    ctx.logJsEvalResponse();
                    log.info(toString);
                    ctx.tellSuccess(msg);
                },
                t -> {
                    ctx.logJsEvalResponse();
                    ctx.tellFailure(msg, t);
                });
    }

    @Override
    public void destroy() {
        if (jsEngine != null) {
            jsEngine.destroy();
        }
    }
}
