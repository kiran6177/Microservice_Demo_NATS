import React, { useState } from 'react'
export const AuthUserContext  = React.createContext(null)

function UserContext({children}) {
    const [user,setUser] = useState(null);
  return (
    <AuthUserContext.Provider value={{user,setUser}}>
        {children}
    </AuthUserContext.Provider>
  )
}

export default UserContext
