import NewMessageEvent from "./NewMessageEvent";
import EventListener from "@domain/types/EventListener";

export interface NewMessageEventListener extends EventListener<NewMessageEvent> {

}
