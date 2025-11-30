import React, { useEffect, useState } from "react";
import "./FollowersCard.css";
import FollowersModal from "../FollowersModal/FollowersModal";
import { getAllUser } from "../../api/UserRequests";
import User from "../User/User";
import { useSelector } from "react-redux";
const FollowersCard = ({ location }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);
  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await getAllUser();
      setPersons(data);
    };
    fetchPersons();
  }, [modalOpened]);

  return (
    <React.Fragment>
      <h3 className="peopleYouMayKnowHeading">People you may know</h3>
      <div className="FollowersCard">
        {persons
          .filter((person) => person._id !== user._id)
          .map((person, id) => (
            <User person={person} key={id} />
          ))}

        <FollowersModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
        />
      </div>
      {!location ? (
        <span className="showMoreText" onClick={() => setModalOpened(true)}>
          Show more
        </span>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default FollowersCard;
