import { pipeline,env } from '@xenova/transformers';

env.allowLocalModels = null;

class Pipeline {
  static task = 'object-detection';
  static model = 'Xenova/detr-resnet-50';
  static instance = null;

static async getInstance(progress_callback = null) {
  if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener('message',async event => {
  let detector = await Pipeline.getInstance((x)=>{
    self.postMessage(x);
  })

  let result = await detector(event.data.image,{percentage:true});
  
  self.postMessage({status:'complete',result});
})