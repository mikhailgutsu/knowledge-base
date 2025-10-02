interface Config {
  BASE_URL: string
  BASE_PORT: string
  GET_INIT_CALL: string
  SET_INIT_CALL: string
  GET_ANSWER_ACCEPT: string
  GET_ANSWER_DENY: string
  SET_ANSWER_ACCEPT: string
  SET_ANSWER_DENY: string
  GET_DOOR_LOCK: string
  GET_DOOR_UNLOCK: string
  SET_DOOR_LOCK: string
  SET_DOOR_UNLOCK: string
  GET_VIDEO_STOP: string
  GET_VIDEO_START: string
  SET_VIDEO_STOP: string
  SET_VIDEO_START: string
  GET_AUDIO_STOP: string
  GET_AUDIO_START: string
  SET_AUDIO_STOP: string
  SET_AUDIO_START: string
}

const CONFIG: Config = {
  /* Back IP */
  BASE_URL: ' ',
  BASE_PORT: ' ',

  /* ROOT Checker/Setter */
  GET_INIT_CALL: ' ',
  SET_INIT_CALL: ' ',

  /* Answer on call */
  GET_ANSWER_ACCEPT: ' ',
  GET_ANSWER_DENY: ' ',
  SET_ANSWER_ACCEPT: ' ',
  SET_ANSWER_DENY: ' ',

  /* Door manipulation */
  GET_DOOR_LOCK: ' ',
  GET_DOOR_UNLOCK: ' ',
  SET_DOOR_LOCK: ' ',
  SET_DOOR_UNLOCK: ' ',

  /* Video Start/Stop */
  GET_VIDEO_STOP: ' ',
  GET_VIDEO_START: ' ',
  SET_VIDEO_STOP: ' ',
  SET_VIDEO_START: ' ',

  /* Audio Start/Stop */
  GET_AUDIO_STOP: ' ',
  GET_AUDIO_START: ' ',
  SET_AUDIO_STOP: ' ',
  SET_AUDIO_START: ' ',
}

export default CONFIG
