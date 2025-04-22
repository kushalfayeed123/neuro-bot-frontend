import { Component } from "@angular/core";

@Component({
  selector: "app-chatbot",
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.css"],
})
export class ChatbotComponent {
  customerServiceNumber: string = "+16013178091";

  startChat(): void {
    // Build the WhatsApp URL
    const chatUrl = `https://wa.me/${this.customerServiceNumber}`;
    // Open the WhatsApp chat in a new tab
    window.open(chatUrl, "_blank");
  }
}
