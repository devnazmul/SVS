import {
  FaLinkedin,
  FaGithub,
  FaGitlab,
  FaSquareFacebook,
  FaYoutube,
  FaSquareTwitter,
  FaTwitch,
  FaInstagram,
  FaSquareDribbble,
  FaSquareBehance,
  FaStackOverflow,
  FaSlack,
  FaGlobe,
} from "react-icons/fa6";
export const DisplayIcon = ({ text, className }) => {
  switch (true) {
    case text === "FaLinkedin":
      return <FaLinkedin className={className} />;
    case text === "FaGithub":
      return <FaGithub className={className} />;
    case text === "FaGitlab":
      return <FaGitlab className={className} />;
    case text === "FaSquareFacebook":
      return <FaSquareFacebook className={className} />;
    case text === "FaYoutube":
      return <FaYoutube className={className} />;
    case text === "FaSquareTwitter":
      return <FaSquareTwitter className={className} />;
    case text === "FaTwitch":
      return <FaTwitch className={className} />;
    case text === "FaInstagram":
      return <FaInstagram className={className} />;
    case text === "FaSquareDribbble":
      return <FaSquareDribbble className={className} />;
    case text === "FaSquareBehance":
      return <FaSquareBehance className={className} />;
    case text === "FaStackOverflow":
      return <FaStackOverflow className={className} />;
    case text === "FaSlack":
      return <FaSlack className={className} />;
    case text === "FaGlobe":
      return <FaGlobe className={className} />;
    default:
      return null;
  }
};
