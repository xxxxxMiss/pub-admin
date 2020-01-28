/*
  Usage: npm install -S @alicloud/pop-core
  powered by alinode (http://alinode.aliyun.com/)
*/

const Core = require('@alicloud/pop-core')
// 构建一个阿里云client, 用于发起请求
// 构建阿里云client时需要设置AccessKey ID和AccessKey Secret

//设置参数，指定角色ARN，并设置Policy以进一步限制STS Token获取的权限
const params = {
  // Action: 'AssumeRole',
  RoleArn: 'acs:ram::$accountID:role/aliyunosstokengeneratorrole',
  RoleSessionName: 'oss',
  // Policy: '<policy>',
  // unit: second
  DurationSeconds: 3600
}

function createClient() {
  let client = null
  return function getClient() {
    if (!client) {
      client = new Core({
        accessKeyId: '',
        accessKeySecret: '',
        endpoint: 'https://sts.cn-beijing.aliyuncs.com',
        // endpoint: 'https://oss-cn-beijing.aliyuncs.com',
        apiVersion: '2015-04-01'
      })
    }
    return client
  }
}

const getClient = createClient()

exports.getAssumeRole = function getAssumeRole() {
  //   {
  //     "Credentials": {
  //         "AccessKeyId": "STS.L4aBSCSJVMuKg5U1****",
  //         "AccessKeySecret": "wyLTSmsyPGP1ohvvw8xYgB29dlGI8KMiH2pK****",
  //         "Expiration": "2015-04-09T11:52:19Z",
  //         "SecurityToken": "********"
  //     },
  //     "AssumedRoleUser": {
  //         "arn": "acs:ram::123456789012****:assumed-role/AdminRole/alice",
  //         "AssumedRoleUserId":"34458433936495****:alice"
  //         },
  //     "RequestId": "6894B13B-6D71-4EF5-88FA-F32781734A7F"
  // }
  return getClient().request('AssumeRole', params)
}
