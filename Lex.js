
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

		let node = this;
		let AWS = require("aws-sdk");
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
            let proxy = require('proxy-agent');
            AWS.config.update({
                httpOptions: { agent: new proxy(this.awsConfig.proxy) }
            });
        }

		let awsService = new AWS.LexRuntime( { 'region': node.region } );

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
		
			let _cb=function(err,data){
				node.sendMsg(err,data);
			};

			if (typeof service[node.operation] === "function"){
				node.status({fill:"blue",shape:"dot",text:node.operation});
				service[node.operation](awsService,msg,_cb);
			} else {
				node.error("failed: Operation node defined - "+node.operation);
			}

		});

		let copyArg=function(src,arg,out,outArg,isObject){
			let tmpValue=src[arg];
			outArg = (typeof outArg !== 'undefined') ? outArg : arg;

			if (typeof src[arg] !== 'undefined'){
				if (isObject && typeof src[arg] === "string" && src[arg] !== "") {
					tmpValue=JSON.parse(src[arg]);
				}
				out[outArg]=tmpValue;
			}
                        //AWS API takes 'Payload' not 'payload' (see Lambda)
                        if (arg === "Payload" && typeof tmpValue === 'undefined'){
                                out[arg]=src["payload"];
                        }

		};

		let service={};

        // PostContent:[
        //     '#BotAliasAttr','#BotNameAttr','#ContentTypeAttr','#InputStreamAttr','#UserIdAttr','#AcceptAttr','#RequestAttributesAttr','#SessionAttributesAttr'
        // ],
		service.PostContent=function(svc,msg,cb){
			let params={};
			//copyArgs
			
			copyArg(n,"BotAlias",params,undefined,false);
            copyArg(n,"BotName",params,undefined,false);
            copyArg(n,"ContentType",params,undefined,false);
            copyArg(n,"InputStream",params,undefined,false);
            copyArg(n,"UserId",params,undefined,false);
            copyArg(n,"Accept",params,undefined,false);
            copyArg(n,"RequestAttributes",params,undefined,false);
            copyArg(n,"SessionAttributes",params,undefined,false);

			copyArg(msg,"BotAlias",params,undefined,false);
            copyArg(msg,"BotName",params,undefined,false);
            copyArg(msg,"ContentType",params,undefined,false);
            copyArg(msg,"InputStream",params,undefined,false);
            copyArg(msg,"UserId",params,undefined,false);
            copyArg(msg,"Accept",params,undefined,false);
            copyArg(msg,"RequestAttributes",params,undefined,false);
            copyArg(msg,"SessionAttributes",params,undefined,false);

            svc.batchDetectDominantLanguage(params,cb);
		};

        // PostText:[
        //     '#BotAliasAttr','#BotNameAttr','#InputTextAttr','#UserIdAttr','#RequestAttributesAttr','#SessionAttributesAttr'
        // ]
		service.PostText=function(svc,msg,cb){
			let params={};
			//copyArgs

            copyArg(n,"BotAlias",params,undefined,false);
            copyArg(n,"BotName",params,undefined,false);
            copyArg(n,"InputText",params,undefined,false);
            copyArg(n,"UserId",params,undefined,false);
            copyArg(n,"RequestAttributes",params,undefined,false);
            copyArg(n,"SessionAttributes",params,undefined,false);

            copyArg(msg,"BotAlias",params,undefined,false);
            copyArg(msg,"BotName",params,undefined,false);
            copyArg(msg,"InputText",params,undefined,false);
            copyArg(msg,"UserId",params,undefined,false);
            copyArg(msg,"RequestAttributes",params,undefined,false);
            copyArg(msg,"SessionAttributes",params,undefined,false);
			
			svc.batchDetectEntities(params,cb);
		};

	}

	RED.nodes.registerType("AWS Lex Runtime", AmazonAPINode);

};
