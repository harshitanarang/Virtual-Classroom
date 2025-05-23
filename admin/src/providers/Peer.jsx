/*

Copyright 2024 Himanshu Dinkar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {
    createContext,
    useMemo,
    useContext,
    useEffect,
    useState,
    useCallback,
  } from "react";
  
  const PeerContext = createContext();
  export const usePeer = () => useContext(PeerContext);
  
  export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null);
  
  // setting up new connection
    const peer = useMemo(
      () =>
        new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        }),
      []
    );
  
    const createOffer = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
    };
    
  // accepting offer
    const createAnswer = async (offer) => {
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
    };
  
    const setRemoteAns = async (ans) => {
      await peer.setRemoteDescription(ans);
    };
  
    const sendStream = async (stream) => {
      // Get a list of already added tracks
      const existingSenders = peer.getSenders().map((sender) => sender.track);
    
      // Iterate over the tracks and add only if not already added
      for (const track of stream.getTracks()) {
        if (!existingSenders.includes(track)) {
          peer.addTrack(track, stream);
        }
      }
    };
    
  
    const handleTrackEvent = useCallback((ev) => {
      console.log("Track event fired:", ev);
      if (ev.streams && ev.streams[0]) {
          console.log("Received remote stream:", ev.streams[0].id, ev.streams[0]);
          console.log("Tracks on received stream:", ev.streams[0].getTracks());
          setRemoteStream(ev.streams[0]);
      } else if (ev.track) {
           console.warn("Track event received, but no streams array. Track:", ev.track);
           // Fallback: Sometimes streams array isn't populated immediately
           // You might need to construct a new MediaStream if necessary
           // const newStream = new MediaStream([ev.track]);
           // setRemoteStream(newStream); // Use with caution, might miss other tracks
      } else {
          console.error("Track event received without streams or track.");
      }
    }, []);
  
  
    useEffect(() => {
      peer.addEventListener("track", handleTrackEvent);
      return () => {
        peer.removeEventListener("track", handleTrackEvent);
      };
    }, [peer, handleTrackEvent]);
  
    return (
      <PeerContext.Provider
        value={{
          peer,
          createOffer,
          createAnswer,
          setRemoteAns,
          sendStream,
          remoteStream,
        }}
      >
        {props.children}
      </PeerContext.Provider>
    );
  };
  