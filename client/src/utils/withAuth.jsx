import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";

export const withAuth = (WrappedComponent) => {
  function WithAuthComponent(props) {
    const { currentUser, updateUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (currentUser?.expiresAt && new Date().getTime() >= currentUser.expiresAt) {
        updateUser(null);
        navigate("/");
        toast.info("Session expired. Please sign in again.");
      }
    }, [currentUser, navigate, updateUser]);

    if (!currentUser) {
      navigate('/signin');
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  
  return WithAuthComponent;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
