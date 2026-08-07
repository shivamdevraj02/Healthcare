import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const RoomPage = () => {
  const { roomId } = useParams();

  const myMeeting = async (element) => {
    const appID =1066155728;

    const serverSecret = "592be2a6b53af94be64349500ab789f5";

    const kitToken =
      ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        "Shivam"
      );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,

      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  return (
    <div
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default RoomPage;