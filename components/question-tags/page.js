// "use client"

// import { useState } from "react";
// import Chip from "@mui/material/Chip";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";

// export default function QuestionTags({tags, setTags, name, valueTags}) {
//   const [error, setError] = useState("");
//   const handleChange = (event, value) => {
//     if (value.length > 5) {
//       setError("You can only add up to 5 tags.");
//       return;
//     }
//     setTags(value);
//     if (value.length < 2) {
//       setError("Please add at least 2 tags.");
//     } else {
//       setError("");
//     }
//   };

//   return (
//     <div>
//       <Autocomplete
//         name={name}
//         multiple
//         freeSolo
//         id="tags-standard"
//         options={[]}
//         //value={valueTags}
//         onChange={tags.length > 5 ? null : handleChange}
//         renderTags={(value, getTagProps) =>
//           value.map((option, index) => (
//             <Chip
//               //value={valueTags}
//               variant="filled"
//               label={option}
//               {...getTagProps({ index })}
//               key={index}
//             />
//           ))
//         }
//         renderInput={(params) => (
//           <TextField
//             name={name}
//             value={valueTags}
//             {...params}
//             variant="outlined"
//             label="Tags"
//             placeholder={
//               tags.length >= 5 ? "Maximum 5 tags reached" : "Enter tags"
//             }
//             error={error}
//             helperText={error}
//             disabled={tags.length >= 5}
//           />
//         )}
//       />
//     </div>
//   );
// }
"use client"

import { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function QuestionTags({ tags, setTags }) {
  const [error, setError] = useState("");

  const handleChange = (event, value) => {
    if (value.length > 5) {
      setError("You can only add up to 5 tags.");
      return;
    }
    setTags(value);

    if (value.length < 2) {
      setError("Please add at least 2 tags.");
    } else {
      setError("");
    }
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      id="tags-standard"
      options={[]}
      value={tags}
      onChange={handleChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="filled"
            label={option}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder={
            tags.length >= 5 ? "Maximum 5 tags reached" : "Enter tags"
          }
          error={!!error}
          helperText={error}
          disabled={tags.length >= 5}
        />
      )}
    />
  );
}
