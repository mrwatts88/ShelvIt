import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as awsCertificateManager from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { Bucket } from '@aws-cdk/aws-s3';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { ViewerCertificate } from '@aws-cdk/aws-cloudfront';

const url: string = 'www.shelv.it';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const publicAssets: Bucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: url,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    const certificate: Certificate = new awsCertificateManager.Certificate(this, 'WebsiteCertificate', {
      domainName: url,
      validation: awsCertificateManager.CertificateValidation.fromDns(),
    });

    const viewerCertificate: ViewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
      aliases: [url],
    });

    new cloudfront.CloudFrontWebDistribution (
        this,
        'WebsiteDistribution',
        {
          originConfigs: [{
            s3OriginSource: {
                  s3BucketSource: publicAssets,
            },
            behaviors: [{ isDefaultBehavior: true }],
          }],
          viewerCertificate
        }
    );

    // Deploy static Code into Bucket.
    new s3Deployment.BucketDeployment(this, 'DeployStaticWebsite', {
      sources: [s3Deployment.Source.asset('../website')],
      destinationBucket: publicAssets,
    });
  }
}
