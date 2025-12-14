export const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex: RegExp =/^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  
export const passwordMessage: string ="Password must be at least 8 characters long and contain at least 2 uppercase letters, 2 lowercase letters, 1 number and 1 special character.";

export const usernameRegex = /^(?![_.])[a-zA-Z0-9._]{3,20}$/;

export const fullnameRegex = /^(?!\s)(?!.*\s$).{3,50}$/;