import "./styles.css"
import Image from "next/image";

export default async function UserCard({ id, name, username, image }) {
  return (
    <div className="user-card-container">
      {image ? (
        <Image
          src={image}
          width={100}
          height={100}
          alt="Profile Img"
          className="profile-img"
        />
      ) : (
        // fallback avatar (optional)
        <div className="profile-img fallback-avatar" />
      )}
      <br />
      <div className="name-container">
        <h3 className="user-name">{name}</h3>
      </div>
      <p style={{ color: "rgba(169,169,169, 0.7)" }}>@{username}</p>
    </div>
  );
}
