type MessageSetup = {
   timestamp?: number;
   content: string;
   self?: boolean;
}

export default class Message {
   timestamp: number;
   content: string;
   self?: boolean;

   constructor (setup: MessageSetup) {
      const { timestamp, content, self } = setup;

      this.self = Boolean(self);
      this.timestamp = timestamp || Date.now();
      this.content = content;
   }
}
