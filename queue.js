import { newError } from './error.js';

export const queue = [];

export function add(video){
    if(video != null){
        queue.push(video);
    } else {
        errorMessage = newError("Error with adding the video.");
    }
}

export function remove(video){
    if(video != null){
        queue.remove(video);
    } else {
        errorMessage = newError("Error with removing the video.");
    }
}