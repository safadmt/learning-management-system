import { Link } from "react-router-dom"
const DisplayUserCredential = ({userid})=> {

    const handleLogout = () => {
        
    }

    const list = [{label: 'Dashboared', link:`/dashboared/${userid}`},
      {label: 'Logout', link: handleLogout()}, {label: 'Edit Profile', link: `/dashboared/${userid}/edit-profile`}]

      return (
      <div className="md:absolute top-28 left-10 bg-black-400 text-white border-2">
        <ul>
          {list.map((item)=> {
           return <li><Link to={item.link}>{item.label}</Link></li>
          })}
        </ul>
      </div>
    )
  }

export default DisplayUserCredential;