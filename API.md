---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 默认模块

Base URLs:

# Authentication

# 认证

<a id="opIdloginWithUsername"></a>

## POST 用户名密码登录

POST /auth/login

使用用户名与密码获取JWT令牌，同时记录登录IP并刷新每日检测额度。

> Body 请求参数

```json
{
  "username": "string",
  "password": "pa$$word",
  "rememberMe": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "token": "string",
    "type": "string",
    "id": 0,
    "username": "string",
    "email": "user@example.com",
    "role": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|登录成功，返回JWT及基础用户信息。|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|登录失败或参数校验不通过。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdloginWithEmail"></a>

## POST 邮箱密码登录

POST /auth/email-login

通过邮箱与密码登录，内部仍使用用户名进行认证。

> Body 请求参数

```json
{
  "email": "user@example.com",
  "password": "pa$$word"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[EmailLoginRequest](#schemaemailloginrequest)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "token": "string",
    "type": "string",
    "id": 0,
    "username": "string",
    "email": "user@example.com",
    "role": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|登录成功，返回JWT及基础用户信息。|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|登录失败或账号不存在。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdregisterUser"></a>

## POST 用户注册

POST /auth/register

校验用户名与邮箱唯一性并验证邮箱验证码，注册成功后初始化用户额度。

> Body 请求参数

```json
{
  "username": "string",
  "password": "string",
  "email": "user@example.com",
  "phone": "string",
  "emailVerificationCode": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[RegisterRequest](#schemaregisterrequest)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|注册成功，返回注册的用户名。|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|用户名或邮箱已存在，验证码无效等错误。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdsendEmailVerificationCode"></a>

## POST 发送邮箱验证码

POST /auth/verify-email

向指定邮箱发送六位验证码，有效期10分钟，可用于注册或找回密码流程。

> Body 请求参数

```json
{
  "email": "user@example.com"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[EmailVerificationRequest](#schemaemailverificationrequest)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|验证码发送成功。|[ApiResponse](#schemaapiresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|邮件发送失败或参数错误。|[ApiResponse](#schemaapiresponse)|

# 用户

<a id="opIdgetUserProfile"></a>

## GET 获取个人资料

GET /profile

返回当前登录用户的完整资料、额度及检测统计。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "username": "string",
    "email": "user@example.com",
    "phone": "string",
    "avatar": "string",
    "role": "string",
    "registerTime": "2019-08-24T14:15:22Z",
    "lastLoginTime": "2019-08-24T14:15:22Z",
    "totalQuota": 0,
    "usedQuota": 0,
    "remainingQuota": 0,
    "dailyFreeQuota": 0,
    "detectionCount": 0,
    "memberDays": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdupdateUserProfile"></a>

## PUT 更新个人资料

PUT /profile

按需更新用户名、邮箱、手机号或头像，内部会校验唯一性。

> Body 请求参数

```yaml
username: ""
email: ""
phone: ""
avatar: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 否 |新的用户名（需保持唯一）。|
|» email|body|string(email)| 否 |新邮箱（需保持唯一）。|
|» phone|body|string| 否 |手机号，格式需满足大陆手机号规则。|
|» avatar|body|string| 否 |头像URL。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|更新成功。|[ApiResponse](#schemaapiresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数校验失败或用户名/邮箱冲突。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

<a id="opIdupdatePassword"></a>

## PUT 修改登录密码

PUT /profile/password

校验当前密码后更新为新密码。

> Body 请求参数

```yaml
currentPassword: ""
newPassword: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» currentPassword|body|string(password)| 是 |当前密码。|
|» newPassword|body|string(password)| 是 |新密码，需满足6-20位长度。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|密码更新成功。|[ApiResponse](#schemaapiresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|当前密码错误或新密码不合法。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

<a id="opIdgetUserInfo"></a>

## GET 获取用户信息与额度

GET /user/info

返回当前用户的基础信息及配额统计。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "username": "string",
    "email": "user@example.com",
    "phone": "string",
    "avatar": "string",
    "role": "string",
    "totalQuota": 0,
    "usedQuota": 0,
    "remainingQuota": 0,
    "usedCount": 0,
    "dailyLimit": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdgetDashboardStats"></a>

## GET 获取仪表盘统计

GET /user/dashboard/stats

汇总用户近况及各类型检测统计指标。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "imageCounts": "string",
    "textCounts": "string",
    "videoCounts": "string",
    "audioCounts": "string",
    "imageTrend": 0,
    "textTrend": 0,
    "videoTrend": 0,
    "audioTrend": 0,
    "averageAccuracy": 0,
    "accuracyTrend": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|统计计算失败。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

# 检测

<a id="opIdgetRecentDetections"></a>

## GET 查询近期检测记录

GET /detection/recent

返回当前用户最近的检测记录列表，默认最多5条。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|limit|query|integer| 否 |返回的记录数量，最大值由服务端控制。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "userId": 0,
      "detectionTypeId": 0,
      "fileUrl": "string",
      "fileName": "string",
      "fileSize": 0,
      "content": "string",
      "result": 0,
      "confidence": 0.1,
      "detectionTime": "2019-08-24T14:15:22Z",
      "status": 0,
      "errorMessage": "string",
      "analysis": "string",
      "fragmentResults": "string",
      "totalFragments": 0,
      "aiFragments": 0,
      "humanFragments": 0,
      "uncertainFragments": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdsubmitDetection"></a>

## POST 发起AIGC检测

POST /detection/detect

根据`type`参数执行文本、图片、视频或音频检测。文本检测支持直接输入或上传文档，
并可按段落启用分片分析；图片检测对接阿里云内容安全服务；音视频暂时给出模拟结果。
请求需具备有效额度，额度不足时会返回429。

> Body 请求参数

```yaml
file: ""
text: ""
type: text
enableFragmentAnalysis: "true"
splitStrategy: paragraph

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file|body|string(binary)| 否 |上传的待检测文件（文档）。|
|» text|body|string| 否 |直接输入的待检测文本内容。|
|» type|body|string| 否 |检测类型，文本默认为`text`。|
|» enableFragmentAnalysis|body|boolean| 否 |文本检测时是否启用分片分析。|
|» splitStrategy|body|string| 否 |文本分片策略，`paragraph`为严格按段落。|

#### 枚举值

|属性|值|
|---|---|
|» type|text|
|» type|image|
|» type|video|
|» type|audio|
|» splitStrategy|paragraph|
|» splitStrategy|semantic|
|» splitStrategy|default|
|» splitStrategy|sentence|
|» splitStrategy|fixed|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "aiProbability": 100,
    "analysis": "string",
    "fragments": [
      {
        "fragmentIndex": 0,
        "fragmentText": "string",
        "text": "string",
        "aiProbability": 100,
        "humanProbability": 100,
        "confidence": 100,
        "category": "[",
        "categoryDescription": "string",
        "categoryColor": "string"
      }
    ],
    "totalFragments": 0,
    "aiFragments": 0,
    "humanFragments": 0,
    "uncertainFragments": 0,
    "fragmentAnalysis": true
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|检测成功，返回综合判定及（可选的）分片结果。|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误或文件类型不支持。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|
|429|[Too Many Requests](https://tools.ietf.org/html/rfc6585#section-4)|检测额度耗尽。|[ApiResponse](#schemaapiresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|检测服务异常。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|category|ai|
|category|human|
|category|uncertain|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

状态码 **429**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

# 历史记录

<a id="opIdlistDetectionHistory"></a>

## GET 查询全部检测历史

GET /history

返回当前用户的完整检测记录列表，按时间倒序。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "fileName": "string",
      "type": 0,
      "typeName": "string",
      "time": "2019-08-24T14:15:22Z",
      "result": "string",
      "probability": 0.1,
      "status": 0,
      "errorMessage": "string",
      "fileUrl": "string",
      "content": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdlistHistoryByType"></a>

## GET 按类型筛选检测历史

GET /history/type/{typeId}

根据检测类型ID筛选用户历史记录。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|typeId|path|integer| 是 |检测类型ID（1-图片、2-文本、3-视频、4-音频）。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "fileName": "string",
      "type": 0,
      "typeName": "string",
      "time": "2019-08-24T14:15:22Z",
      "result": "string",
      "probability": 0.1,
      "status": 0,
      "errorMessage": "string",
      "fileUrl": "string",
      "content": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdlistHistoryByTimeRange"></a>

## GET 按时间范围筛选检测历史

GET /history/time

支持按`today`、`week`、`month`或全部记录筛选。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|timeRange|query|string| 否 |时间范围，不传或`all`表示全部。|

#### 枚举值

|属性|值|
|---|---|
|timeRange|today|
|timeRange|week|
|timeRange|month|
|timeRange|all|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "fileName": "string",
      "type": 0,
      "typeName": "string",
      "time": "2019-08-24T14:15:22Z",
      "result": "string",
      "probability": 0.1,
      "status": 0,
      "errorMessage": "string",
      "fileUrl": "string",
      "content": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdlistHistoryByResult"></a>

## GET 按检测结果筛选历史

GET /history/result/{result}

根据检测结果（AI生成或人工创作）筛选记录，其他值返回全部记录。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|result|path|string| 是 |检测结果关键字，`ai`表示AI生成，`human`表示人工创作，其他值返回全部。|

#### 枚举值

|属性|值|
|---|---|
|result|ai|
|result|human|
|result|all|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "fileName": "string",
      "type": 0,
      "typeName": "string",
      "time": "2019-08-24T14:15:22Z",
      "result": "string",
      "probability": 0.1,
      "status": 0,
      "errorMessage": "string",
      "fileUrl": "string",
      "content": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdgetHistoryDetail"></a>

## GET 获取检测记录详情

GET /history/{id}

根据记录ID查询详细检测信息。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |检测记录ID。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "fileName": "string",
    "type": 0,
    "typeName": "string",
    "time": "2019-08-24T14:15:22Z",
    "result": "string",
    "probability": 0.1,
    "status": 0,
    "errorMessage": "string",
    "fileUrl": "string",
    "content": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|记录不存在。|None|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIddeleteHistoryRecord"></a>

## DELETE 删除检测记录

DELETE /history/{id}

删除指定检测记录，成功后返回提示信息。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |检测记录ID。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|删除成功。|[ApiResponse](#schemaapiresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|删除失败或记录不属于当前用户。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

# 充值

## GET 充值记录

GET /

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

<a id="opIdcreateAlipayQrCode"></a>

## POST 创建支付宝扫码支付

POST /recharge/alipay/precreate

为已创建的充值订单生成支付宝扫码支付二维码

> Body 请求参数

```yaml
orderId: a1b2c3d4e5f6g7h8

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» orderId|body|string| 是 |订单号|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "二维码创建成功",
  "data": {
    "success": true,
    "outTradeNo": "a1b2c3d4e5f6g7h8",
    "qrCode": "https://qr.alipay.com/bax08532ycm3ry7xxxx",
    "code": "10000",
    "msg": "Success"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|
|»» success|boolean|false|none||none|
|»» outTradeNo|string|false|none||none|
|»» qrCode|string|false|none||二维码字符串|
|»» code|string|false|none||none|
|»» msg|string|false|none||none|

<a id="opIdlistRechargePackages"></a>

## GET 查询所有充值套餐

GET /recharge/packages

返回当前可售卖的充值套餐列表。0

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "price": 0.1,
      "quota": 0,
      "validity": "string",
      "popular": true,
      "features": [
        "string"
      ]
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|

### 返回数据结构

<a id="opIdqueryAlipayPaymentStatus"></a>

## GET 查询支付宝订单状态

GET /recharge/alipay/query/{orderId}

查询支付宝订单的支付状态，前端可轮询此接口

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|string| 是 |订单号|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "orderId": "a1b2c3d4e5f6g7h8",
    "tradeNo": "2024101422001234567890",
    "tradeStatus": "TRADE_SUCCESS",
    "totalAmount": 9.9,
    "buyerLogonId": "abc***@alipay.com",
    "isPaid": true
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|
|»» orderId|string|false|none||none|
|»» tradeNo|string|false|none||none|
|»» tradeStatus|string|false|none||none|
|»» totalAmount|number|false|none||none|
|»» buyerLogonId|string|false|none||none|
|»» isPaid|boolean|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|tradeStatus|WAIT_BUYER_PAY|
|tradeStatus|TRADE_SUCCESS|
|tradeStatus|TRADE_FINISHED|
|tradeStatus|TRADE_CLOSED|

<a id="opIdgetRechargePackage"></a>

## GET 查询套餐详情

GET /recharge/packages/{id}

根据套餐ID获取详细信息。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |套餐ID。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "price": 0.1,
    "quota": 0,
    "validity": "string",
    "popular": true,
    "features": [
      "string"
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|套餐不存在。|None|

### 返回数据结构

<a id="opIdalipayNotifyCallback"></a>

## POST 支付宝异步通知

POST /recharge/alipay/notify

支付宝服务器回调接口，无需认证

> Body 请求参数

```yaml
out_trade_no: ""
trade_no: ""
trade_status: ""
total_amount: 0

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» out_trade_no|body|string| 否 |none|
|» trade_no|body|string| 否 |none|
|» trade_status|body|string| 否 |none|
|» total_amount|body|number| 否 |none|

> 返回示例

> 200 Response

```
"success"
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|string|

<a id="opIdcreateRechargeOrder"></a>

## POST 创建充值订单

POST /recharge/order

生成新的充值订单并返回订单号。

> Body 请求参数

```yaml
packageId: 0
paymentMethod: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» packageId|body|integer(int64)| 是 |充值套餐ID。|
|» paymentMethod|body|string| 是 |支付方式，例如`支付宝`或`微信`。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|订单创建成功。|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|套餐不存在或参数错误。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务内部错误。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdcancelRechargeOrder"></a>

## POST 取消订单

POST /recharge/cancel/{orderId}

取消待支付的充值订单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|string| 是 |订单号|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "订单已取消"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

<a id="opIdcompleteRechargeOrder"></a>

## POST 完成充值订单

POST /recharge/complete/{orderId}

将订单标记为完成并为用户增加额度。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|string| 是 |订单号。|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|充值成功。|[ApiResponse](#schemaapiresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|订单不存在或状态异常。|[ApiResponse](#schemaapiresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|充值处理异常。|[ApiResponse](#schemaapiresponse)|

<a id="opIdlistTransactions"></a>

## GET 查询充值交易记录

GET /recharge/transactions

返回用户的充值订单流水，可按时间范围过滤。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|filter|query|string| 否 |时间过滤条件，默认为全部。|

#### 枚举值

|属性|值|
|---|---|
|filter|all|
|filter|7days|
|filter|30days|
|filter|90days|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": "string",
      "date": "2019-08-24T14:15:22Z",
      "packageName": "string",
      "quota": 0,
      "amount": 0.1,
      "paymentMethod": "string",
      "status": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|查询成功。|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

# 健康检查

<a id="opIdgetHealthStatus"></a>

## GET 获取服务健康状态

GET /health/status

汇总服务运行状态、阿里云检测配置及网络连通性。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "service": "string",
    "timestamp": 0,
    "aliyunDetectionEnabled": true,
    "aliyunEndpoint": "string",
    "aliyunConnectivity": true,
    "detectionMode": "string",
    "serviceStatus": "string",
    "error": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|状态获取成功。|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|状态检查失败。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdgetNetworkDiagnostic"></a>

## GET 获取网络诊断信息

GET /health/network

返回本机网络环境信息、阿里云连通性以及DNS测试结果。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "networkInfo": "string",
    "aliyunConnectivity": true,
    "dnsTest": {
      "property1": "string",
      "property2": "string"
    },
    "error": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|诊断成功。|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|网络诊断失败。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIddiagnoseAliyunService"></a>

## GET 阿里云服务自检

GET /health/aliyun

检查阿里云相关配置、连通性并给出问题列表与建议。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "enableAliyunDetection": true,
    "endpoint": "string",
    "accessKeyId": "string",
    "accessKeySecret": "string",
    "aliyunConnectivity": true,
    "connectivityError": "string",
    "serviceStatus": "string",
    "mode": "string",
    "issues": [
      "string"
    ],
    "solutions": [
      "string"
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|自检完成。|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|自检失败。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

<a id="opIdtestAigcService"></a>

## GET 测试阿里云AIGC服务接入

GET /health/test-aigc-service

通过反射执行客户端创建与Token获取，用于排查AIGC接入问题。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "clientCreation": "string",
    "tokenTest": "string",
    "clientError": "string",
    "endpoint": "string",
    "enableAliyunDetection": true,
    "suggestion": "string",
    "error": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|测试执行完成。|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|测试执行失败。|[ApiResponse](#schemaapiresponse)|

### 返回数据结构

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||请求是否成功。|
|» message|string|true|none||友好的提示信息。|
|» data|null|false|none||业务数据，类型因接口而异。|

# 数据模型

<h2 id="tocS_ErrorResponse">ErrorResponse</h2>

<a id="schemaerrorresponse"></a>
<a id="schema_ErrorResponse"></a>
<a id="tocSerrorresponse"></a>
<a id="tocserrorresponse"></a>

```json
{
  "success": false,
  "message": "string",
  "data": null
}

```

### 属性

allOf

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[ApiResponse](#schemaapiresponse)|false|none||none|

and

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|object|false|none||none|
|» success|boolean|false|none||none|
|» data|null|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|success|false|

<h2 id="tocS_LoginRequest">LoginRequest</h2>

<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "username": "string",
  "password": "pa$$word",
  "rememberMe": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|true|none||用户名。|
|password|string(password)|true|none||密码。|
|rememberMe|boolean|false|none||是否记住登录状态。|

<h2 id="tocS_UserInfoResponse">UserInfoResponse</h2>

<a id="schemauserinforesponse"></a>
<a id="schema_UserInfoResponse"></a>
<a id="tocSuserinforesponse"></a>
<a id="tocsuserinforesponse"></a>

```json
{
  "id": 0,
  "username": "string",
  "email": "user@example.com",
  "phone": "string",
  "avatar": "string",
  "role": "string",
  "totalQuota": 0,
  "usedQuota": 0,
  "remainingQuota": 0,
  "usedCount": 0,
  "dailyLimit": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|username|string|false|none||none|
|email|string(email)|false|none||none|
|phone|string¦null|false|none||none|
|avatar|string¦null|false|none||none|
|role|string|false|none||none|
|totalQuota|integer|false|none||总额度。|
|usedQuota|integer|false|none||已使用额度。|
|remainingQuota|integer|false|none||剩余额度。|
|usedCount|integer|false|none||已使用次数（同`usedQuota`）。|
|dailyLimit|integer|false|none||每日免费额度。|

<h2 id="tocS_EmailLoginRequest">EmailLoginRequest</h2>

<a id="schemaemailloginrequest"></a>
<a id="schema_EmailLoginRequest"></a>
<a id="tocSemailloginrequest"></a>
<a id="tocsemailloginrequest"></a>

```json
{
  "email": "user@example.com",
  "password": "pa$$word"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|email|string(email)|true|none||注册邮箱。|
|password|string(password)|true|none||登录密码。|

<h2 id="tocS_DashboardStatsResponse">DashboardStatsResponse</h2>

<a id="schemadashboardstatsresponse"></a>
<a id="schema_DashboardStatsResponse"></a>
<a id="tocSdashboardstatsresponse"></a>
<a id="tocsdashboardstatsresponse"></a>

```json
{
  "imageCounts": "string",
  "textCounts": "string",
  "videoCounts": "string",
  "audioCounts": "string",
  "imageTrend": 0,
  "textTrend": 0,
  "videoTrend": 0,
  "audioTrend": 0,
  "averageAccuracy": 0,
  "accuracyTrend": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|imageCounts|string|false|none||图片检测次数（字符串形式）。|
|textCounts|string|false|none||none|
|videoCounts|string|false|none||none|
|audioCounts|string|false|none||none|
|imageTrend|integer|false|none||none|
|textTrend|integer|false|none||none|
|videoTrend|integer|false|none||none|
|audioTrend|integer|false|none||none|
|averageAccuracy|integer|false|none||none|
|accuracyTrend|integer|false|none||none|

<h2 id="tocS_RegisterRequest">RegisterRequest</h2>

<a id="schemaregisterrequest"></a>
<a id="schema_RegisterRequest"></a>
<a id="tocSregisterrequest"></a>
<a id="tocsregisterrequest"></a>

```json
{
  "username": "string",
  "password": "string",
  "email": "user@example.com",
  "phone": "string",
  "emailVerificationCode": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|true|none||用户名，需唯一。|
|password|string|true|none||登录密码。|
|email|string(email)|true|none||邮箱地址，需唯一。|
|phone|string|false|none||手机号码，可选，需符合大陆手机号格式。|
|emailVerificationCode|string|true|none||邮箱验证码，6位数字。|

<h2 id="tocS_EmailVerificationRequest">EmailVerificationRequest</h2>

<a id="schemaemailverificationrequest"></a>
<a id="schema_EmailVerificationRequest"></a>
<a id="tocSemailverificationrequest"></a>
<a id="tocsemailverificationrequest"></a>

```json
{
  "email": "user@example.com"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|email|string(email)|true|none||接收验证码的邮箱。|

<h2 id="tocS_JwtResponse">JwtResponse</h2>

<a id="schemajwtresponse"></a>
<a id="schema_JwtResponse"></a>
<a id="tocSjwtresponse"></a>
<a id="tocsjwtresponse"></a>

```json
{
  "token": "string",
  "type": "string",
  "id": 0,
  "username": "string",
  "email": "user@example.com",
  "role": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|token|string|true|none||JWT访问令牌。|
|type|string|true|none||令牌类型，固定为`Bearer`。|
|id|integer(int64)|true|none||用户ID。|
|username|string|true|none||用户名。|
|email|string(email)|true|none||用户邮箱。|
|role|string|true|none||用户角色。|

<h2 id="tocS_UserProfileResponse">UserProfileResponse</h2>

<a id="schemauserprofileresponse"></a>
<a id="schema_UserProfileResponse"></a>
<a id="tocSuserprofileresponse"></a>
<a id="tocsuserprofileresponse"></a>

```json
{
  "id": 0,
  "username": "string",
  "email": "user@example.com",
  "phone": "string",
  "avatar": "string",
  "role": "string",
  "registerTime": "2019-08-24T14:15:22Z",
  "lastLoginTime": "2019-08-24T14:15:22Z",
  "totalQuota": 0,
  "usedQuota": 0,
  "remainingQuota": 0,
  "dailyFreeQuota": 0,
  "detectionCount": 0,
  "memberDays": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|username|string|false|none||none|
|email|string(email)|false|none||none|
|phone|string¦null|false|none||none|
|avatar|string¦null|false|none||none|
|role|string|false|none||none|
|registerTime|string(date-time)|false|none||none|
|lastLoginTime|string(date-time)¦null|false|none||none|
|totalQuota|integer|false|none||none|
|usedQuota|integer|false|none||none|
|remainingQuota|integer|false|none||none|
|dailyFreeQuota|integer|false|none||none|
|detectionCount|integer|false|none||累计检测次数。|
|memberDays|integer|false|none||注册至今的天数。|

<h2 id="tocS_DetectionRecordResponse">DetectionRecordResponse</h2>

<a id="schemadetectionrecordresponse"></a>
<a id="schema_DetectionRecordResponse"></a>
<a id="tocSdetectionrecordresponse"></a>
<a id="tocsdetectionrecordresponse"></a>

```json
{
  "id": 0,
  "fileName": "string",
  "type": 0,
  "typeName": "string",
  "time": "2019-08-24T14:15:22Z",
  "result": "string",
  "probability": 0.1,
  "status": 0,
  "errorMessage": "string",
  "fileUrl": "string",
  "content": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|fileName|string¦null|false|none||none|
|type|integer|false|none||检测类型ID。|
|typeName|string¦null|false|none||none|
|time|string(date-time)|false|none||none|
|result|string|false|none||检测结果中文描述。|
|probability|number(double)|false|none||AI生成概率。|
|status|integer|false|none||0-处理中，1-完成，2-失败。|
|errorMessage|string¦null|false|none||none|
|fileUrl|string¦null|false|none||none|
|content|string¦null|false|none||none|

<h2 id="tocS_DetectionRecord">DetectionRecord</h2>

<a id="schemadetectionrecord"></a>
<a id="schema_DetectionRecord"></a>
<a id="tocSdetectionrecord"></a>
<a id="tocsdetectionrecord"></a>

```json
{
  "id": 0,
  "userId": 0,
  "detectionTypeId": 0,
  "fileUrl": "string",
  "fileName": "string",
  "fileSize": 0,
  "content": "string",
  "result": 0,
  "confidence": 0.1,
  "detectionTime": "2019-08-24T14:15:22Z",
  "status": 0,
  "errorMessage": "string",
  "analysis": "string",
  "fragmentResults": "string",
  "totalFragments": 0,
  "aiFragments": 0,
  "humanFragments": 0,
  "uncertainFragments": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|userId|integer(int64)|false|none||none|
|detectionTypeId|integer|false|none||none|
|fileUrl|string¦null|false|none||none|
|fileName|string¦null|false|none||none|
|fileSize|integer(int64)¦null|false|none||none|
|content|string¦null|false|none||none|
|result|integer|false|none||0表示人工创作，1表示AI生成。|
|confidence|number(double)|false|none||none|
|detectionTime|string(date-time)|false|none||none|
|status|integer|false|none||none|
|errorMessage|string¦null|false|none||none|
|analysis|string¦null|false|none||none|
|fragmentResults|string¦null|false|none||none|
|totalFragments|integer¦null|false|none||none|
|aiFragments|integer¦null|false|none||none|
|humanFragments|integer¦null|false|none||none|
|uncertainFragments|integer¦null|false|none||none|

<h2 id="tocS_RechargePackageResponse">RechargePackageResponse</h2>

<a id="schemarechargepackageresponse"></a>
<a id="schema_RechargePackageResponse"></a>
<a id="tocSrechargepackageresponse"></a>
<a id="tocsrechargepackageresponse"></a>

```json
{
  "id": 0,
  "name": "string",
  "price": 0.1,
  "quota": 0,
  "validity": "string",
  "popular": true,
  "features": [
    "string"
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|name|string|false|none||none|
|price|number(double)|false|none||none|
|quota|integer|false|none||none|
|validity|string|false|none||套餐有效期描述。|
|popular|boolean|false|none||none|
|features|[string]|false|none||none|

<h2 id="tocS_TransactionResponse">TransactionResponse</h2>

<a id="schematransactionresponse"></a>
<a id="schema_TransactionResponse"></a>
<a id="tocStransactionresponse"></a>
<a id="tocstransactionresponse"></a>

```json
{
  "id": "string",
  "date": "2019-08-24T14:15:22Z",
  "packageName": "string",
  "quota": 0,
  "amount": 0.1,
  "paymentMethod": "string",
  "status": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string|false|none||订单号。|
|date|string(date-time)|false|none||创建时间。|
|packageName|string|false|none||none|
|quota|integer|false|none||none|
|amount|number(double)|false|none||none|
|paymentMethod|string|false|none||none|
|status|string|false|none||交易状态描述。|

<h2 id="tocS_HealthStatus">HealthStatus</h2>

<a id="schemahealthstatus"></a>
<a id="schema_HealthStatus"></a>
<a id="tocShealthstatus"></a>
<a id="tocshealthstatus"></a>

```json
{
  "service": "string",
  "timestamp": 0,
  "aliyunDetectionEnabled": true,
  "aliyunEndpoint": "string",
  "aliyunConnectivity": true,
  "detectionMode": "string",
  "serviceStatus": "string",
  "error": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|service|string|false|none||服务运行状态。|
|timestamp|integer(int64)|false|none||状态生成时间戳（毫秒）。|
|aliyunDetectionEnabled|boolean|false|none||none|
|aliyunEndpoint|string|false|none||none|
|aliyunConnectivity|boolean|false|none||none|
|detectionMode|string|false|none||当前检测模式，可能为`aliyun`或`mock`。|
|serviceStatus|string|false|none||服务健康度，可能为`healthy`、`degraded`等。|
|error|string¦null|false|none||none|

<h2 id="tocS_NetworkDiagnostic">NetworkDiagnostic</h2>

<a id="schemanetworkdiagnostic"></a>
<a id="schema_NetworkDiagnostic"></a>
<a id="tocSnetworkdiagnostic"></a>
<a id="tocsnetworkdiagnostic"></a>

```json
{
  "networkInfo": "string",
  "aliyunConnectivity": true,
  "dnsTest": {
    "property1": "string",
    "property2": "string"
  },
  "error": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|networkInfo|string|false|none||本机网络接口及DNS探测信息。|
|aliyunConnectivity|boolean|false|none||none|
|dnsTest|object|false|none||DNS解析结果映射。|
|» **additionalProperties**|string|false|none||none|
|error|string¦null|false|none||none|

<h2 id="tocS_AliyunDiagnostic">AliyunDiagnostic</h2>

<a id="schemaaliyundiagnostic"></a>
<a id="schema_AliyunDiagnostic"></a>
<a id="tocSaliyundiagnostic"></a>
<a id="tocsaliyundiagnostic"></a>

```json
{
  "enableAliyunDetection": true,
  "endpoint": "string",
  "accessKeyId": "string",
  "accessKeySecret": "string",
  "aliyunConnectivity": true,
  "connectivityError": "string",
  "serviceStatus": "string",
  "mode": "string",
  "issues": [
    "string"
  ],
  "solutions": [
    "string"
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|enableAliyunDetection|boolean|false|none||none|
|endpoint|string|false|none||none|
|accessKeyId|string|false|none||AccessKey ID（已脱敏）。|
|accessKeySecret|string|false|none||AccessKey Secret配置情况。|
|aliyunConnectivity|boolean|false|none||none|
|connectivityError|string¦null|false|none||none|
|serviceStatus|string|false|none||none|
|mode|string|false|none||none|
|issues|[string]|false|none||none|
|solutions|[string]|false|none||none|

<h2 id="tocS_AigcServiceTest">AigcServiceTest</h2>

<a id="schemaaigcservicetest"></a>
<a id="schema_AigcServiceTest"></a>
<a id="tocSaigcservicetest"></a>
<a id="tocsaigcservicetest"></a>

```json
{
  "clientCreation": "string",
  "tokenTest": "string",
  "clientError": "string",
  "endpoint": "string",
  "enableAliyunDetection": true,
  "suggestion": "string",
  "error": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|clientCreation|string¦null|false|none||none|
|tokenTest|string¦null|false|none||none|
|clientError|string¦null|false|none||none|
|endpoint|string|false|none||none|
|enableAliyunDetection|boolean|false|none||none|
|suggestion|string|false|none||none|
|error|string¦null|false|none||none|

<h2 id="tocS_ApiResponse">ApiResponse</h2>

<a id="schemaapiresponse"></a>
<a id="schema_ApiResponse"></a>
<a id="tocSapiresponse"></a>
<a id="tocsapiresponse"></a>

```json
{
  "success": true,
  "message": "string",
  "data": null
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|success|boolean|true|none||请求是否成功。|
|message|string|true|none||友好的提示信息。|
|data|null|false|none||业务数据，类型因接口而异。|

<h2 id="tocS_DetectionResultResponse">DetectionResultResponse</h2>

<a id="schemadetectionresultresponse"></a>
<a id="schema_DetectionResultResponse"></a>
<a id="tocSdetectionresultresponse"></a>
<a id="tocsdetectionresultresponse"></a>

```json
{
  "aiProbability": 100,
  "analysis": "string",
  "fragments": [
    {
      "fragmentIndex": 0,
      "fragmentText": "string",
      "text": "string",
      "aiProbability": 100,
      "humanProbability": 100,
      "confidence": 100,
      "category": "ai",
      "categoryDescription": "string",
      "categoryColor": "string"
    }
  ],
  "totalFragments": 0,
  "aiFragments": 0,
  "humanFragments": 0,
  "uncertainFragments": 0,
  "fragmentAnalysis": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|aiProbability|number|true|none||AI生成概率，百分比形式(0-100)。|
|analysis|string|true|none||详细分析说明。|
|fragments|[[DetectionFragmentResult](#schemadetectionfragmentresult)]|false|none||分片检测结果列表（仅在启用分片时返回）。|
|totalFragments|number|false|none||总片段数（可选）。|
|aiFragments|number|false|none||AI片段数（可选）。|
|humanFragments|number|false|none||人工片段数（可选）。|
|uncertainFragments|number|false|none||不确定片段数（可选）。|
|fragmentAnalysis|boolean|false|none||是否启用了分片分析（可选）。|

<h2 id="tocS_DetectionFragmentResult">DetectionFragmentResult</h2>

<a id="schemadetectionfragmentresult"></a>
<a id="schema_DetectionFragmentResult"></a>
<a id="tocSdetectionfragmentresult"></a>
<a id="tocsdetectionfragmentresult"></a>

```json
{
  "fragmentIndex": 0,
  "fragmentText": "string",
  "text": "string",
  "aiProbability": 100,
  "humanProbability": 100,
  "confidence": 100,
  "category": "ai",
  "categoryDescription": "string",
  "categoryColor": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|fragmentIndex|number|false|none||片段索引。|
|fragmentText|string|false|none||片段原文。|
|text|string|false|none||与`fragmentText`相同，兼容前端字段。|
|aiProbability|number|false|none||该片段的AI概率。|
|humanProbability|number|false|none||该片段的人工创作概率。|
|confidence|number|false|none||置信度。|
|category|string|false|none||片段分类，取值为`ai`、`human`或`uncertain`。|
|categoryDescription|string|false|none||分类描述（中文）。|
|categoryColor|string|false|none||分类对应的颜色值。|

#### 枚举值

|属性|值|
|---|---|
|category|ai|
|category|human|
|category|uncertain|

