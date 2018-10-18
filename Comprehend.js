
/**
 * Copyright 2017 Daniel Thomas.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";

	function AmazonAPINode(n) {
		RED.nodes.createNode(this,n);
		this.awsConfig = RED.nodes.getNode(n.aws);
		this.region = n.region;
		this.operation = n.operation;
		this.name = n.name;
		this.region = this.awsConfig.region;
		this.accessKey = this.awsConfig.accessKey;
		this.secretKey = this.awsConfig.secretKey;

		var node = this;
		var AWS = require("aws-sdk");
		AWS.config.update({
			accessKeyId: this.accessKey,
			secretAccessKey: this.secretKey,
			region: this.region
		});
		if (!AWS) {
			node.warn("Missing AWS credentials");
			return;
		}

        if (this.awsConfig.proxyRequired){
            var proxy = require('proxy-agent');
            AWS.config.update({
                httpOptions: { agent: new proxy(this.awsConfig.proxy) }
            });
        }

		var awsService = new AWS.Comprehend( { 'region': node.region } );

		node.on("input", function(msg) {
			node.sendMsg = function (err, data) {
				if (err) {
				node.status({fill:"red",shape:"ring",text:"error"});
				node.error("failed: " + err.toString(),msg);
				return;
				} else {
				msg.payload = data;
				node.status({});
				}
				node.send(msg);
			};
		
			var _cb=function(err,data){
				node.sendMsg(err,data);
			}		

			if (typeof service[node.operation] == "function"){
				node.status({fill:"blue",shape:"dot",text:node.operation});
				service[node.operation](awsService,msg,_cb);
			} else {
				node.error("failed: Operation node defined - "+node.operation);
			}

		});
		var copyArg=function(src,arg,out,outArg,isObject){
			var tmpValue=src[arg];
			outArg = (typeof outArg !== 'undefined') ? outArg : arg;

			if (typeof src[arg] !== 'undefined'){
				if (isObject && typeof src[arg]=="string" && src[arg] != "") { 
					tmpValue=JSON.parse(src[arg]);
				}
				out[outArg]=tmpValue;
			}
                        //AWS API takes 'Payload' not 'payload' (see Lambda)
                        if (arg=="Payload" && typeof tmpValue == 'undefined'){
                                out[arg]=src["payload"];
                        }

		}

		var service={};

		// BatchDetectDominantLanguage:[
		// 	'#LanguageTextListAttr'
		// 	],
		service.BatchDetectDominantLanguage=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageTextList",params,undefined,false);
			
			copyArg(msg,"LanguageTextList",params,undefined,false); 
			
			svc.batchDetectDominantLanguage(params,cb);
		}

		// BatchDetectEntities:[
		// 	'#LanguageCodeAttr','#TextListAttr'
		// 	],
		service.BatchDetectEntities=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"TextList",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"TextList",params,undefined,false); 
			
			svc.batchDetectEntities(params,cb);
		}

		// BatchDetectKeyPhrases:[
		// 	'#LanguageCodeAttr','#TextListAttr'
		// 	],
		service.BatchDetectKeyPhrases=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"TextList",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"TextList",params,undefined,false); 
			
			svc.batchDetectKeyPhrases(params,cb);
		}

		// BatchDetectSentiment:[
		// 	'#LanguageCodeAttr','#TextListAttr'
		// 	],
		service.BatchDetectSentiment=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"TextList",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"TextList",params,undefined,false); 
			
			svc.batchDetectSentiment(params,cb);
		}

		// BatchDetectSyntax:[
		// 	'#LanguageCodeAttr','#TextListAttr'
		// 	],
		service.BatchDetectSyntax=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"TextList",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"TextList",params,undefined,false); 
			
			svc.batchDetectSyntax(params,cb);
		}

		// DescribeDominantLanguageDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.DescribeDominantLanguageDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 
			
			svc.describeDominantLanguageDetectionJob(params,cb);
		}

		// DescribeEntitiesDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.DescribeEntitiesDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 
			
			svc.describeEntitiesDetectionJob(params,cb);
		}

		// DescribeKeyPhrasesDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.DescribeKeyPhrasesDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 
			
			svc.describeKeyPhrasesDetectionJob(params,cb);
		}

		// DescribeSentimentDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.DescribeSentimentDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 
			
			svc.describeSentimentDetectionJob(params,cb);
		}

		// DescribeTopicsDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.DescribeTopicsDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 
			
			svc.describeTopicsDetectionJob(params,cb);
		}

		// DetectDominantLanguage:[
		// 	'#LanguageTextAttr'
		// 	],
		service.DetectDominantLanguage=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageText",params,undefined,false);
			
			copyArg(msg,"LanguageText",params,undefined,false); 

			svc.detectDominantLanguage(params,cb);
		}

		// DetectEntities:[
		// 	'#LanguageCodeAttr','#TextAttr'
		// 	],
		service.DetectEntities=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"Text",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"Text",params,undefined,false); 
			
			svc.detectEntities(params,cb);
		}

		// DetectKeyPhrases:[
		// 	'#LanguageCodeAttr','#TextAttr'
		// 	],
		service.DetectKeyPhrases=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"Text",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"Text",params,undefined,false); 
			
			svc.detectKeyPhrases(params,cb);
		}

		// DetectSentiment:[
		// 	'#LanguageCodeAttr','#TextAttr'
		// 	],
		service.DetectSentiment=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"Text",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"Text",params,undefined,false); 
			
			svc.detectSentiment(params,cb);
		}

		// DetectSyntax:[
		// 	'#LanguageCodeAttr','#TextAttr'
		// 	],
		service.DetectSyntax=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"LanguageCode",params,undefined,false);
			copyArg(n,"Text",params,undefined,false);
			
			copyArg(msg,"LanguageCode",params,undefined,false); 
			copyArg(msg,"Text",params,undefined,false); 

			svc.detectSyntax(params,cb);
		}

		// ListDominantLanguageDetectionJobs:[

		// 	],		
		service.ListDominantLanguageDetectionJobs=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.listDominantLanguageDetectionJobs(params,cb);
		}

		// ListEntitiesDetectionJobs:[

		// 	],
		service.ListEntitiesDetectionJobs=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.listEntitiesDetectionJobs(params,cb);
		}

		// ListKeyPhrasesDetectionJobs:[

		// 	],
		service.ListKeyPhrasesDetectionJobs=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.listKeyPhrasesDetectionJobs(params,cb);
		}

		// ListSentimentDetectionJobs:[
			
		// 	],
		service.ListSentimentDetectionJobs=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.listSentimentDetectionJobs(params,cb);
		}

		// ListTopicsDetectionJobs:[
			
		// 	],
		service.ListTopicsDetectionJobs=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.listTopicsDetectionJobs(params,cb);
		}

		// StartDominantLanguageDetectionJob:[
			
		// 	],
		service.StartDominantLanguageDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.startDominantLanguageDetectionJob(params,cb);
		}

		// StartEntitiesDetectionJob:[
			
		// 	],
		service.StartEntitiesDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.startEntitiesDetectionJob(params,cb);
		}

		// StartKeyPhrasesDetectionJob:[
			
		// 	],
		service.StartKeyPhrasesDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.startKeyPhrasesDetectionJob(params,cb);
		}

		// StartSentimentDetectionJob:[
			
		// 	],
		service.StartSentimentDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.startSentimentDetectionJob(params,cb);
		}

		// StartTopicsDetectionJob:[
			
		// 	],
		service.StartTopicsDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			// @TODO
			
			svc.startTopicsDetectionJob(params,cb);
		}

		// StopDominantLanguageDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.StopDominantLanguageDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 
			
			svc.stopDominantLanguageDetectionJob(params,cb);
		}

		// StopEntitiesDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.StopEntitiesDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 

			svc.stopEntitiesDetectionJob(params,cb);
		}

		// StopKeyPhrasesDetectionJob:[
		// 	'#JobIdAttr'
		// 	],
		service.StopKeyPhrasesDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
			copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 

			svc.stopKeyPhrasesDetectionJob(params,cb);
		}

		// StopSentimentDetectionJob:[
		// 	'#JobIdAttr'
		// 	]		
		service.StopSentimentDetectionJob=function(svc,msg,cb){
			var params={};
			//copyArgs
			
		 	copyArg(n,"JobId",params,undefined,false); 
			
			copyArg(msg,"JobId",params,undefined,false); 

			svc.stopSentimentDetectionJob(params,cb);
		}

	}

	RED.nodes.registerType("AWS Comprehend", AmazonAPINode);

};
