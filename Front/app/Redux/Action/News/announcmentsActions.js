import Types from "../../Types.json";

export const fetchAnnouncements = () => {
  return async (dispatch) => {
    try {
      // Simulate network/API call
      const data = [
        { id: 1, title: "News 1", desc: "Description 1", images: [] },
        { id: 2, title: "News 2", desc: "Description 2", images: [] },
      ];
      dispatch({ type: Types.Announcement.SET_ANNOUNCEMENTS, payload: data });
    } catch (error) {
      console.error(error);
    }
  };
};

export const addAnnouncement = (announcement) => {
  return {
    type: Types.Announcement.ADD_ANNOUNCEMENT,
    payload: announcement,
  };
};
