import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const ChatBot = () => {
    return (
        <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
            <Textarea
                className="w-full border-0 focus-visible:ring-0 resize-none shadow-none"
                placeholder="Ask me anything..."
                maxLength={1000}
            />
            <Button className="rounded-full cursor-pointer shadow-sm w-9 h-9">
                <FaArrowUp className="" />
            </Button>
        </div>
    );
};

export default ChatBot;
