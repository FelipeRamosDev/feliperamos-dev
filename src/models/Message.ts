type MessageSetup = {
   timestamp?: number;
   content: string;
   self?: boolean;
}

export default class Message {
   public timestamp: number;
   public content: string;
   public self?: boolean;

   constructor (setup: MessageSetup) {
      const { timestamp, content, self } = setup;

      this.self = Boolean(self);
      this.timestamp = timestamp || Date.now();
      this.content = content;
   }

   get date(): Date {
      return new Date(this.timestamp);
   }

   get dateString(): string {
      return this.date.toLocaleDateString();
   }

   get timeString(): string {
      const hour = this.date.getHours();
      const minute = this.date.getMinutes();
      const second = this.date.getSeconds();

      return `${hour}:${minute}:${second}`;
   }
}
