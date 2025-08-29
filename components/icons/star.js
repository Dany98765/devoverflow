"use client"

import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { deleteFromCollection, saveToCollection } from '@/utils/actions/collection.action';

export default function StarQuestion({ id, email, starred, setStarred, refreshCollection, setError }) {
  const handleToggle = async () => {
    if (!email) {
      setError("You have to be authenticated in order to add a question in your collections tab!");
      return;
    }

    if (starred) {
      const { success } = await deleteFromCollection({ id, email });
      if (success) {
        setStarred(false);
        refreshCollection?.();
      }
    } else {
      const { success } = await saveToCollection({ id, email });
      if (success) {
        setStarred(true);
        refreshCollection?.();
      }
    }
  };

  return (
    <div style={{ marginTop: "5px", cursor: "pointer" }}>
      {starred ? (
        <StarIcon
          sx={{ color: "#FF7518", fontSize: 27 }}
          onClick={handleToggle}
        />
      ) : (
        <StarOutlineIcon
          sx={{ color: "#FF7518", fontSize: 27 }}
          onClick={handleToggle}
        />
      )}
    </div>
  );
}
