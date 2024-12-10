type UserDetails = {
    bio?: string;
    picture?: string;
  };
  
  const userDetails: Record<string, UserDetails> = {}; 
  
  export const fetchUserDetails = async (studentId: string): Promise<UserDetails> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userDetails[studentId] || {}); 
      }, 500); 
    });
  };
  
  export const saveUserDetails = async (studentId: string, data: UserDetails): Promise<UserDetails> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        userDetails[studentId] = { ...userDetails[studentId], ...data }; 
        resolve(userDetails[studentId]);
      }, 500); 
    });
  };
  