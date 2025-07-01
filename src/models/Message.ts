type MessageSetup = {
   timestamp?: number;
   content: string;
   from?: 'user' | 'assistant';
   threadID?: string | null;
}

export default class Message {
   public content: string;
   public from: 'user' | 'assistant';
   public timestamp?: number;
   public self?: boolean;
   public threadID?: string | null;
   public dateString: string;
   public timeString: string;

   constructor (setup: MessageSetup) {
      const { timestamp, content, from = 'user', threadID } = setup;

      this.threadID = threadID;
      this.self = Boolean(from === 'user');
      this.timestamp = timestamp || Date.now();
      this.content = content;
      this.from = from;
      this.dateString = this.getDateString();
      this.timeString = this.getTimeString();
   }

   get date(): Date {
      return new Date(this.timestamp || Date.now());
   }

   getDateString(): string {
      const options: Intl.DateTimeFormatOptions = {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
      };

      return this.date.toLocaleDateString(undefined, options);
   }

   getTimeString(): string {
      const options: Intl.DateTimeFormatOptions = {
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
      };

      return this.date.toLocaleTimeString(undefined, options);
   }

   serialize() {
      return { ...this };
   }
}
