import { useEffect, useState } from "react"


function GroupMemberCard({userId, index}) {

    const [userDetails, setUserDetails] = useState('');

    // Get the user details using userid
    const fetchUserDetails = async () => {

        try {

            const response = await fetch("http://localhost:2000/api/user-details", 
                {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({userId})
                }
            );
    
            if(response.ok){
                const data = await response.json();
                setUserDetails(data.details);
            }
            
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        fetchUserDetails();
    }, [])
    

  return (
    <div className="relative">
        <li className="p-4 bg-slate-300 rounded-lg shadow hover:shadow-md">
            <p className="text-xl font-medium text-black">{userDetails.username}</p>
            <p className="text-sm text-gray-500">{userDetails.email}</p>

            {index === 0 && (
            <p className="admin text-sm font-bold text-green-600 absolute top-2 right-2">
                Admin
            </p>
            )}
        </li>
    </div>
  )
}

export default GroupMemberCard