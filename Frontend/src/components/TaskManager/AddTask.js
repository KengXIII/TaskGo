import firebase from "@firebase/app";
import SortTask from "./SortTask";
import updateTasks from "./updateTasks";

export default function addTask(
  name,
  priority,
  deadline,
  category,
  description,
  taskId
) {
  var tasks;
  var storedCategory;
  var sortView;
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);
  docRef
    .get()
    .then((doc) => {
      tasks = doc.data().tasks;
      storedCategory = doc.data().category;
      sortView = doc.data().sortView;
      const newTasks = [
        ...tasks.slice(0),
        {
          name: name,
          priority: priority,
          isComplete: false,
          dateCreated: new Date(),
          dateCompleted: "",
          deadline: deadline,
          category: category,
          description: description,
          taskId: taskId,
          interval: false,
        },
      ];
      var newStoredCategory;
      if (
        storedCategory.some((pair) => {
          return pair.name === category;
        })
      ) {
        newStoredCategory = storedCategory.map((pair) => {
          return pair.name === category
            ? { name: pair.name, value: pair.value + 1 }
            : { name: pair.name, value: pair.value };
        });
      } else {
        newStoredCategory = [...storedCategory, { name: category, value: 1 }];
      }
      newStoredCategory = newStoredCategory.sort((pair1, pair2) => {
        return pair1.name < pair2.name ? -1 : 1;
      });
      docRef.update({ category: newStoredCategory });

      updateTasks(newTasks);
    })
    .then(() => {
      SortTask(sortView);
    });
}
