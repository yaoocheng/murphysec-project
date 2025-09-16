<template>
    <el-dialog title="风险验证" width="840px" align-center>
        <div class="risk-verify-content">
            <div class="verify-section">
                <h3 class="section-title">1、验证恶意命令是否已被禁止</h3>
                <div class="description">使用工具（如 curl）模拟对 Jolokia HTTP 接口的请求，会试执行被禁止的命令（如 exec）。</div>

                <div class="code-block">
                    <pre>curl -X POST -H "Content-Type: application/json" \
-d
'{"type":"exec","mbean":"com.sun.management:type=DiagnosticCommand","operation":"gcClassHistogram","arguments":[]}' \
http:///jolokia</pre>
                </div>

                <div class="expected-result">
                    <h4>预期结果：</h4>
                    <ul>
                        <li>返回 HTTP 403 (Forbidden) 或类似错误，表示禁止执行 exec 命令</li>
                        <li>返回 HTTP 403 (Forbidden) 或类似错误，表示禁止执行 exec 命令</li>
                    </ul>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.risk-verify-content {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 24px;

    .verify-section {
        .section-title {
            font-weight: 500;
            color: #3c3c3c;
            margin-bottom: 8px;
            font-size: 16px;
        }

        .description {
            color: #858585;
            margin-bottom: 8px;
            line-height: 1.5;
        }

        .code-block {
            background: #F7F8FB;
            border-radius: 4px;
            padding: 16px;
            margin-bottom: 16px;

            pre {
                font-family: monospace;
                white-space: pre-wrap;
                word-wrap: break-word;
                margin: 0;
                color: #3c3c3c;
            }
        }

        .expected-result {
            h4 {
                font-size: 14px;
                font-weight: 400;
                color: #3c3c3c;
                margin-bottom: 8px;
            }

            ul {
                list-style: none;
                padding-left: 0;
                margin: 0;

                li {
                    color: #858585;
                    line-height: 1.6;
                    margin-bottom: 8px;
                    padding-left: 12px;
                    position: relative;

                    &:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 8px;
                        width: 5px;
                        height: 5px;
                        border-radius: 50%;
                        background-color: #858585;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
}
</style>
