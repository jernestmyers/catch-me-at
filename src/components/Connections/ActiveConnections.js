import { Link } from "react-router-dom";

export default function ActiveConnections({ connectionsObject }) {
  return (
    <div className="connect-div" id="active-connects-container">
      {connectionsObject.active.length ? (
        <h2 id="active-connects-header">
          {connectionsObject.active.length}
          {connectionsObject.active.length === 1
            ? ` Connection`
            : ` Connections`}
        </h2>
      ) : null}

      {connectionsObject.active.length
        ? connectionsObject.active.map((connect) => {
            return (
              <div key={`active-${connect.userId}`}>
                <Link
                  className="connect-link"
                  state={{
                    userId: connect.userId,
                    userName: connect.userName,
                  }}
                  to={`../user/${connect.userId}`}
                >
                  {connect.userName}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    role="img"
                    className="inline-icons"
                  >
                    <path
                      className="link-icon"
                      data-name="layer2"
                      fill="none"
                      stroke="#202020"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      d="M30 62h32V2H2v32"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    ></path>
                    <path
                      className="link-icon"
                      data-name="layer1"
                      fill="none"
                      stroke="#202020"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      d="M26 56V38H8m18 0L2 62"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </Link>
              </div>
            );
          })
        : null}
    </div>
  );
}
