import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";
import * as subscription from "@aws-cdk/aws-sns-subscriptions";
import * as sqs from "@aws-cdk/aws-sqs";
import { FailoverStatusCode } from 'aws-cdk-lib/aws-cloudfront';

export class EmailSubscriptionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const topic = new sns.Topic(this, "myTopic",{
      topicName: "SNS_Topic"
    });

    const dlQueue = new sqs.Queue(this, "DeadletterQueue",{
      queueName: "Dead_Letter_Queue",
      retentionPeriod: cdk.Duration.days(7)
    });

    topic.addSubscription(
      new subscription.EmailSubscription("fazeelamushtaq076@gmail.com",{
        filterPolicy: {
          email: sns.SubscriptionFilter.stringFilter({
            allowlist: ["fazeelamushtaq076@gmail.com"]
          }),
        },
        deadLetterQueue: dlQueue,
        json: false,
      }),
    );

    topic.addSubscription(
      new subscription.SmsSubscription("+923435611764",{
        filterPolicy: {
          cell: sns.SubscriptionFilter.stringFilter({
            allowlist: ["fazeela"]
          }),
        },
        deadLetterQueue: dlQueue,
      }),
    );

    
  }
}
