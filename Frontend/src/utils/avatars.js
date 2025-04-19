/**
 * Animal Avatar URLs for user profiles
 * Using public, free-to-use avatar URLs from DiceBear API
 * Service: https://www.dicebear.com/styles/bottts
 */

export const animalAvatars = [
  // Bear avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=bear1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=bear2&backgroundColor=d1d4f9',
  
  // Cat avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=cat1&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts/svg?seed=cat2&backgroundColor=ffdfbf',
  
  // Dog avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=dog1&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/bottts/svg?seed=dog2&backgroundColor=c0aede',
  
  // Fox avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=fox1&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/bottts/svg?seed=fox2&backgroundColor=d1d4f9',
  
  // Rabbit avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=rabbit1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=rabbit2&backgroundColor=ffd5dc',
  
  // Lion avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=lion1&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/bottts/svg?seed=lion2&backgroundColor=c0aede',

  // Panda avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=panda1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=panda2&backgroundColor=d1d4f9'
];

/**
 * Get a random animal avatar URL
 */
export const getRandomAvatar = () => {
  return animalAvatars[Math.floor(Math.random() * animalAvatars.length)];
};

/**
 * Get an avatar based on username
 * This will ensure a user always gets the same avatar
 */
export const getAvatarForUsername = (username) => {
  const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % animalAvatars.length;
  return animalAvatars[index];
}; 