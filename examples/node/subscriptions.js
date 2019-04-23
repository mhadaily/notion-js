const { Notion } = require("../..");

const notion = new Notion({
  deviceId: process.env.DEVICE_ID
});

const channelAnalysis = notion
  .channelAnalysis("FC1", "FC2")
  .subscribe(channelAnalysis => {
    console.log("channelAnalysis", channelAnalysis);
  });

const kinesis = notion.kinesis("push", "pull").subscribe(kinesis => {
  console.log("kinesis", kinesis);
});

console.log("subscribed to channelAnalysis");
console.log("subscribed to kinesis");

setTimeout(() => {
  channelAnalysis.unsubscribe();
  kinesis.unsubscribe();
  console.log("unsubscribed from channelAnalysis");
  console.log("unsubscribed from kinesis");
}, 4000);
