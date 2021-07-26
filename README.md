# TaskGo
 
## Table of Contents
* [Team Details](#team-details)
* [Introduction](#introduction)
* [User Stories](#user-stories)
* [Scope of Functionalities](#scope-of-functionalities)
* [Tech Stack](#tech-stack)
* [Visuals](#visuals)
* [Comparison with similar platforms](#comparison-with-similar-platforms)
* [Project Status](#project-status)
* [Software Practices](#software-practices)
* [Software Testing and Lessons Learnt](#software-testing-and-lessons-learnt)
 
## Team Details
Team ID: #2483
 
Team Members: Phua Guan Wei & Liao Keng I 
 
Team Advisor: Guo Ai
 
Targeted level of achievement: Apollo 11
 
Project Application: https://task-go-kengxiii.vercel.app/
 
## Introduction
There are so many tasks and assignments to keep track of, given that students have lots of modules to take. Some tasks are repetitive and easy to forget (weekly graded quizzes), while some tasks often take a long time and require students to start early  (weekly labs and problem sets).
 
TaskGo is a web-based todo-list to help users keep track of all their tasks and provides notification when incomplete tasks are about to be due. Some key features includes,
 
* Insert single and routine tasks
* Create categories that users can assign tasks to.
* Deadline, Priority and Category sorting.
* Filtering the tasks by their category.
* Storing completed tasks under a Task History page.
* Email notification for incomplete tasks that are due soon.
* Periodic cleaning of Task History
* Personalised notification settings
 
## User Stories
As a potential TaskGo user, we would want to:
* Be able to look at all the unfinished assignments that we have in an overview page. So that we are able to keep everything concise, and reduce the likelihood of missing out on an important task.
* Be notified before an incomplete task is due soon so that I would not forget to work on them.
* Sort our tasks according to their deadline/specified level of priority, so as to facilitate easier and smoother planning, and enhance viewability.
* Filter our tasks by category so that we can better plan out tasks according to those categories.
* Store our tasks in a “Completion” list, so that we can always refer back to these completed tasks should the time arise. 
 
## Scope of Functionalities
### Social login with Google
Personalised to-do list, easily accessible through social login via Google. 
We chose to implement social login via Google because of its prevalence and popularity in Singapore. As such, issues such as forgetting passwords would be rather unlikely, due to the prevalent use of Google accounts in Singapore.
 
### Task Handling
 
Our tasks are sorted as arrays on the database. In the user's document, the most recent sort criteria is being saved. When tasks are being added to the user's tasklist, TaskGo appends the task to the back of the array and fires our task sorting function on the client's end, before being pushed to Firestore. This would mean that on our database, all tasks are sorted according to the last sorting preference they used. We find that tasks will be loaded quicker this way as compared to keeping our database unsorted and sorting it after we get the array. 
 
Users can insert their tasks in TaskGo. There are 2 types of tasks that can be inserted - Single and Routine. Users are then prompted on information about their tasks. They are:
 
* Name
* Deadline
* Priority
* Category
* Description
* Date of Routine End (For Routine Tasks Only)
* Interval of Routine Task (For Routine Tasks Only)
 
Users can also mark their tasks as complete. The complete tasks are then stored under the ‘Task History’ tab, for up to 7 days by default. Users are able to change this default duration by going under the ‘Settings’ tab. If users marked a task as complete by accident, the revert function brings the task back to the to-do list in sorted order.
 
### Task Sorting
The way in which the tasks are sorted can be changed through the selector at the top right of the Task List. Users are able to make use of 3 sorting methods through this selector:
 
1. Task sorting by deadline - Tasks are sorted according to deadline by default. The task with the closest deadline will be sorted at the top of the page.
2. Task sorting by priority - Tasks with the highest priority level are placed at the top of the overview page.
3. Task sorting by category - Tasks are sorted by their entered categories in alphanumeric order.
 
### Task Filtering
All tasks are created under a certain category. Users can filter the categories they want to view. On render, the task list includes tasks from all categories. We have taken in the feedback from users that their tasklist may be too long, hence making it difficult to focus on what truly needs attention. As such, the filter function helps to narrow down the list to their preference, keeping their dashboard concise and neat. The row of categories serves as checkboxes; filled checkboxes indicate that the category has been added to their filter, whereas unfilled checkboxes remove it. This helped to improve the user's experience as well as viewership, keeping the task list organised. 
 
### Email Notification 
Tasks with deadlines nearing and still incomplete will trigger an email notification. Users will therefore be notified that they have pending tasks that need to be worked on while away from our web application. The number of days before the deadline in which the email is sent can be determined by users under the "Settings" page. 
This will provide better user experience through the increased flexibility in our functionalities. In addition, we have taken into account that students may be more active on school/work email so TaskGo allows users to change their recipient email to an alternative email instead of Gmail, avoiding missing important notifications from TaskGo
 
After the task is being created, our task form gathers information (user's name, deadline, task name, notification settings) and passes it through axios to our backend's URL. From there, our backend schedules the task days before the deadline with the ready email template, to the recipient's email address. Should the task be completed ahead of schedule, TaskGo sends a request to cancel the cron job, hence no email will be sent.
 
### Interval Tasks
TaskGo packages interval tasks into a 3-step process: 
 
1. Create the 1st instance
2. Schedule the email notification for the 1st instance
3. Recurse the whole function for the 2nd instance
 
The function relies on cron jobs to successfully recurse the package over until the next task crosses the interval end date. When that happens, the cron job will no longer continue to recur. 
 
### Task History Clean-up
TaskGo runs a periodic history clean-up at 00:00hrs every day. This is scheduled using the node-cron package. Using firebase configuration, it accesses the task history of all users, filtering out tasks that were completed more than 7 days ago, or otherwise specified by the user in the settings page. Heroku keeps a log of the number of tasks that are being erased from each user daily.
 
## Tech stack
### Firebase & Firestore
We integrated Google’s Firebase and Firestore into our React web-app. This would allow users to sign up to our service with ease and simplify the login process. At the same time, issues like forgotten passwords can be avoided. We received a mixed response pertaining to opening up account creation using regular email, such as NUS Outlook. While some prefer to use their school email to set up their profile and receive updates, there are others who are concerned about the frequent changes to their school email passwords, therefore being locked out of their account. After much evaluation, we have decided to stand by our decision to only support Google social login.
 
Firestore will serve as our database where information like tasks and deadlines will be stored. Every user will create their own profile and personalised settings/preferences through documents. Documents are created based on their UID, which is obtained through firebase authentication, so users will only be able to access, read and write in their own document if they are authorised and logged in. In addition, we have written security rules on our Firebase console to allow read, edit and delete to enhance security.
 
When users log in for the first time, default settings are being set up in their document. Future updates will be saved as fields that can be accessed and read when launching the web application. Fields are immediately updated, saved and reflected on our application without having to refresh. This is implemented through firebase API's querysnapshot function, which pushes changes from the database down to our React app. This reduces the need to access our database and check for changes on an interval basis, hence greatly reducing the amount of read, write and delete usage on our firestore. 
 
 
 
### HTML/CSS/JS/React 
The web-page and UI is developed using the ReactJS library and written in JSX. Formatting is done with CSS. 
 
Our React app is a Single Page Application (SPA) that employs React-Router-DOM. This allows interaction with the user without having to reload the page and request information from the server every time requests are being sent by the user. Therefore, improving the website's loading speed.
### Vercel
We engaged Vercel as our platform to deploy and host our Frontend UI. The site can be accessed at : https://task-go-kengxiii.vercel.app/ 
### Express.js server, deployed on Heroku
We engaged Heroku as our platform to deploy our Backend node server that supports E-mail notifications through nodemailer, as well as cron job manager used for interval tasks and history clean-up function. 
 
Our backend server mainly handles cron jobs that are requested by React app. We secured our backend using CORS policy that blocks all other requests that are not from our TaskGo domain, therefore keeping out malicious users who attempt to gain unauthorised requests.
 
 ## Visuals 
![TaskGo Program Flow](https://user-images.githubusercontent.com/70288012/126909052-9115f147-d3f5-4497-afe0-b1a52b69981f.png)
 
### Examples of use
* Accessing our homepage
![Homepage](https://user-images.githubusercontent.com/77228324/126950898-7d48b3d3-ebaa-413b-96b0-18a2f7907c8f.png)
 
* TaskGo Dashboard
![Dashboard](https://user-images.githubusercontent.com/77228324/126950789-fe8241b2-5a54-44f0-8e17-ecf1f602a25d.png)
 
* Showing description using Tooltip
![Description](https://user-images.githubusercontent.com/77228324/126960339-6aa51a5e-f321-4ba9-bdab-d4178529f6ad.png)
 
* Adding Tasks (Single Task)
![Add Tasks](https://user-images.githubusercontent.com/77228324/126951012-2c964d9c-cf9f-4ed8-bd9e-e6e45b670d39.png)
* Adding Tasks (Routine Task)
![Routine Task](https://user-images.githubusercontent.com/77228324/126952046-5570b318-7da2-4ee5-aa4e-eb0f3c56f8d4.png)
* Task History
![Completed Tasks](https://user-images.githubusercontent.com/77228324/126951117-2c5bcb63-ca87-4152-90e3-6cd07e6478ea.png)
* Task Sorting
![Task Sorting](https://user-images.githubusercontent.com/77228324/126951378-dfc151e9-b869-4053-b923-900e4b30e172.png)
* Task Filtering
![Task Filtering](https://user-images.githubusercontent.com/77228324/126951567-43b6f6f6-e8b8-41c5-8043-6e8f1cfec637.png)
* Settings
 ![Settings](https://user-images.githubusercontent.com/77228324/126951226-d929160e-06c1-4c9d-81bb-8f460d98b251.png)
 
## Comparison with similar platforms
TaskGo is a web-based to-do list that is designed to help our users to keep track of their routine and ad-hoc work in a clear and concise web application. The task can be modified and added according to the user's needs. As such, users would be able to experience flexibility in customising their own schedules. 
 
Other current applications usually provide too many functions, and they tend to make the whole interface appear cluttered and messy. In contrast, we intend to provide users with enhanced UI that keeps task tracking simple through a neat and minimalist styling approach. 
### Google Calendar
Many of the feedback from Milestone 2 had mentioned Google Calendar as a possible replacement for TaskGo. Although it can provide functionality such as routine tasks that TaskGo has to offer, we feel that TaskGo provides additional tools. Some examples include our sorting and filtering features. This, coupled with our simplistic UI design, helps to give a nicer summary of all the impending tasks.
### LumiNUS
LumiNUS highlights the due dates of important submissions / tests, as entered by NUS Module Coordinators. However, some of these dates may not be accurate, and students themselves are unable to make edits and improvements onto such scheduling functionalities.
 
## Project Status
We have currently implemented almost all of our planned features for TaskGo. These implementations are not limited to:
### Front-end
* Implementation of authentication system via Google. 
<br><br>
* All features completed for "Task Dashboard".
    1. A tutorial icon which provides users with a clear guide to each and every feature within "Task Dashboard".
    2. Basic Create-Read-Update-Delete (CRUD) functionalities of a to-do list.
    3. For adding/editing tasks, a pop-up form is used instead of a "Submit button" as implemented previously, allowing for more fields of information to be entered in an aesthetically pleasing manner.
    4. Allowing 2 types of tasks to be created: Single and Routine, through a toggle button in the Task Form. Routine tasks will require 2 additional fields to be filled: interval end date and interval between each task.
    5. Certain fields in the form are marked as "Required" with a asterisk (*), the form would remind the users to enter "Required" fields if they are empty when the "Submit" button is hit.
    6. Users cannot enter deadlines/routine end dates that are before the time of completion. 
    7. Tasks are being displayed under "Task List" in a neat manner. All tasks will be displayed with the following fields:
        - Task Priority (Colour coded)
        - Task Name
        - Task Description
        - Task Category
        - Task Deadline
        - 3 Functionality icons.
    8. Tasks are colour-coded at the far left side of the "Task List" according to their priority. Overdue tasks will have its row highlighted in red, standing out from other tasks.
    9. Simplistic icons that help to make TaskGo more visually appealing to users. From left to right, we have:
        - Task descriptions, usually lengthy and wordy, are now hidden. However, users can still see them by hovering over the icon under the "Description" column.
        - Tasks can be marked as completed, and sent from "Task Dashboard" to "Task History" by clicking on the "Tick" icon.
        - Tasks can be deleted permanently by clicking on the "Bin" icon. Deleting tasks now come with a pop-up confirmation. For routine tasks, users can choose to delete just that specific task, or delete that specific task along with all possible future routine tasks. 
        - Tasks can be edited by clicking on the "Pen" icon. However, we have not yet implemented a feature where we can change a task from Single to Routine through the editing function.
    10. Sorting of tasks is done by deadline in "Task Overview" by default. Users can choose to switch to other sorting modes through the dropdown located above the Task List.
    11. Task filtering by 'Category' is possible by simply selecting the relevant categories under 'Category Filter'. Tasks without a category are labelled with an icon.
    12. Selecting all, and selecting none of the categories is possible by clicking on the relevant icons in 'Category Filter'.
    <br><br>
* All features completed for "Task History".
    1. A tutorial icon which provides users with a clear guide to each and every feature within "Task History".
    2. Sorting of tasks is done by time of completion in "Task History".
    3. Tasks are being displayed under "Task History" in a neat manner. All tasks will be displayed with the following fields:
        - Task Priority (Colour coded)
        - Task Name
        - Task Description
        - Task Category
        - Task Deadline
        - Task Date Completion
        - 2 Functionality icons.
    4. Simplistic icons that help to make TaskGo more visually appealing to users. From left to right, we have:
        - Task descriptions, usually lengthy and wordy, are now hidden. However, users can still see them by hovering over the icon under the "Description" column.
        - Tasks can be deleted permanently by clicking on the "Bin" icon. However, deleting tasks in "Task History" does not come with a confirmation alert.
        - Tasks can be sent back to the "Task Dashboard" page by clicking on the "Rewinding clock" icon. This icon is implemented for careless users who tend to mistakenly mark tasks as "completed".
    5. A feature where tasks will be automatically removed from the "Task History" page by 7 days (default setting). Users can choose to change the number of days by heading to "Settings". The removal of the tasks, if applicable, is done every midnight.
    <br><br>
* All features completed for "Settings".
    1.  A tutorial icon which provides users with a clear guide to each and every feature within "Settings".
    2. Allowing users to make changes and save their changes through "Save Settings". Failure to click on "Save Settings" after making changes would result in no change to the settings.
    3. Implementing a 'Default' button, which sets all of the settings to their default values.
    4. A responsive alert bar that informs users when setting updates are being pushed to the firestore database.
    <br><br>
* Setting up our database.
    1. Tasks that are created are specific to the user. We will never see the tasks from another person's TaskGo anymore.
    2. All of our tasks come with fields that are being queried through the "Add Task" form, every tasks in TaskGo currently possess these fields:
        - Task Name
        - Completed [Boolean]
        - Date Created
        - Date Completed
        - Deadline
        - Priority
        - Task Description
        - Frequency (For "Routine tasks" that are to be implemented in the future.)
    Whenever tasks are added or deleted, these changes are constantly being updated directly onto the database.
    <br><br>
* Feedback corner.
    1. We had found this functionality to be a very useful feedback corner when we find independent users to help and test out the functionalities of TaskGo. Many of the bugs in TaskGo are being surfaced here.
    
### Back-end 
* Launching of notification system via Express.js
    1. An e-mail will be sent as cron jobs whenever tasks are added. These emails will appear when nearing, to remind the users of expiring tasks. Moving forward from milestone 2, we have completed the implementation along with the introduction of our settings function. Users can now choose which email to receive the notifications, instead of the default Gmail account that they use to set up their profile with TaskGo. In addition, for users who would like the reminders to be earlier, they can now change the number of days before the deadline to send the notification.
 
### Future plans
As we come close to the completion of TaskGo, we will finally be working on enhancing our UI and user-friendliness, alongside handling a few last-minute bugs that are being reported via our Feedback Corner. After weeks on publishing and sharing our application, we are pleased to review many of the suggestions given to us through our Google Form.
 
#### Bug Fixing
* Reverting a completed 'routine' task back to the "Task Dashboard" would result in the reverted task being changed back to a 'single' task. 
 
 
#### Secondary Features
* Implementation of Dark Mode, which allows our users to use TaskGo with reduced blue light exposure, helping with the eye strain that comes with prolonged screen time.
* Giving TaskGo more aesthetically pleasing details, such as the mobile version of the application, and also the styling of the tasks/layout of the dashboards. 
* Calendar tab: Linking users to their NUSMods schedule through personalised link. This allows users to gain access to their NUSMods schedule should they need to refer to their schedule for planning
 
## Software Practices
Throughout the development process, we followed strictly to our planning sequence: Ideation, Functionality, Design. Many hours were spent on the ideation phase to build a strong foundation for our project. We began with listing down the core features that we would like to develop on Google Documents. Following that, we created our first Figma Prototype and designed the general look that we envisioned TaskGo to have. 
 
Next, we split the features into components for individual development, which we then combined through the use of Github version control and CodeTogether, which we will elaborate on in the following section.
 
Lastly, when our core features are completed, we worked on enhancing our UI and included responsive components such as alert and confirmation dialogs. In addition, we moved from Material-UI ready-built components to our self-developed CSS flex-box designs to give us more room for customisation.
 
### Git
TaskGo project is held as a single repository on Git, containing both the Frontend and Backend directory. During the course of development, we have created multiple branches to assist us in version control of key features.
* Page Layout
* Sidebar
* Google Firebase Authentication
* Google Firestore
* Backend
* Dynamic task-list
 
When we were working on different components simultaneously, the standard version control procedure was followed:
 
    1. Git fetch
    2. Git pull
    3. Git add .
    4. Git commit -m "Comments on current commit"
    5. Git push 
 
This flow ensures that we get the latest updates from the remote repository before pushing on our new updates, keeping the workflow clean and not missing out on changes.
 
#### Git ignore files
In the first few commits that we made, we realised that there were config files that were being pushed onto the remote. This would not be an issue as long as our repository is private. However, for the deployment of the completed application, we intend to re-request a new set of config files from Firebase and our Gmail API to maintain security in TaskGo.
 
### VSCode
For a seamless way to compile our work together, we used VSCode plugin *CodeTogether* during many of our project meetings. We found ourselves to be very efficient when using this plugin for coding concurrently as a pair.
 
### Yarn package and modules
All of our node packages are being added and managed by Yarn solely, to prevent dependency conflicts. Basic testing of our components were done through local hosts.
 
When our backend express server was set up, we added the 'concurrently' node package that provided convenience in starting up both our nodes backend server as well as our React UI simultaneously. 
 
 
## Software Testing and Lessons Learnt
Throughout our development, we have made a series of testing phases. For individual testing of components, our method of testing are as follows:
1. Basic CRUD functionalities. 
    - Tested by simply adding, editing and deleting the tasks and checking with our Firestore database to make sure that the updates are being registered
    - Reading is being tested by simply creating and deleting tasks, and checking if such actions are being displayed dynamically on the screen.
2. Adding Tasks: Disallowing certain values + Required Fields.
    - Tested by entering the undesired values, and tried submitting the form while leaving out the required fields.
3. Routine Tasks: Checking if they are indeed routine.
    - Tested by changing the routine interval down to 1 minute, and checking if the tasks are indeed being created.
    - Tested with console.log to see if future routine tasks are being scheduled.
    - Deletion check: Checking that deleting all future tasks, and deleting just one task works as intended by setting the interval down to 1 minute, and observing if new tasks are being created or not.
4. Task Sorting
    - A few tasks with the same level of priority, deadline and category are created. They are then tested through selecting the different modes of sorting.
5. Task Filter
    - Tested by creating different tasks, and checking them by selecting both the toggle all/none buttons, and the individual selectors.
    - Tested creating multiple tasks of the same category, and checking if the filtering works on multiple tasks.
6. E-mail Notifications
    - Tested by creating both single and routine tasks, and checking if the emails are sent accordingly. 
    - Everytime a cron-job is fired, we will be able to see messages by using "console.log".
    - The cron-jobs are being cancelled whenever we delete or mark tasks as complete. Tasks that are reverted back into "Task Dashboard" from "Task History" will also re-fire the cron-jobs.
    - While testing, we came to be aware of some special cases. For tasks incorrectly marked as complete before the 24 hour before deadline mark is passed, and if they are reverted back into "Task Dashboard '' after the 24 hours mark is passed, there will be no email notification made. We are still hesitant on calling this feature a 'bug', as we originally intended to develop it such that the shortest duration before the email is sent is 1 day. 
7. History Cleaning
    - Tested by setting the time of deletion to every 1 minute, and putting many tasks into "Task History".
    - Tested with hard-coded date-of-completion to see if it passes the filter check
    - Added logs to our backend server so that it register all forms of changes for our reference and validation
 
### Feedback system
Most of our feedback is done through Google Forms. After Milestone 2, we have opened up the Feedback section and deployed the web on Vercel. As such, we are able to get our fellow NUS students to help us check TaskGo. 
 
Besides the Feedback system, there are times when we invite our friends to come and check out TaskGo via ZOOM Platform. We are also able to gather many feedbacks (Mostly about UI design, and task-management bugs) from this platform.
 
All of their valuable feedbacks are being collected in a Google Form, and some of the more noticeable bugs being pointed out are as follows:
1. Routine tasks that are marked complete, and then reverted, are being changed to single tasks. (In progress)
2. Categories that are left empty cannot be filtered, as it is impossible to click on an empty string. (Fixed by replacing them with icons)
3. Categories like an empty string, and spaces can be created and treated as different categories under Task Dashboard. (Fixed by changing all of such inputs as an empty string, and displaying them with icons)
4. Some of the icons are not intuitive. (Fixed by creating tutorials at the top right corner of every page.)
5. Clicking on 'Save Settings' will result in a "Settings updated successfully!" alert, regardless of whether there are changes or not. (We are hesitant to think of this as a bug as of now, as this means that the "Save Settings" button is working as intended).
 
### Major Bug that we addressed
1. Developing task list to display tasks dynamically
 
    One huge bug that we attempted to address was the issue of task lists not updating when tasks are created on different browsers. When Browser A creates a task, Browser B which is opened before the task is created would not register the change until it is being refreshed. 
 
    Our 1st solution was to set periodic intervals to get data from the database. There were 2 issues to this solution: huge amount of read requests on Firestore and clashes between writing task and getting data. 
 
    | Issues | Description |
    | ---------| ----------- |
    | Huge amount of read request | A short interval of read would increase the stress of firestore, making lots of unnecessary usage. This would pose lots of problems when our user pool increases
    | Clashes between read and write operations | When creation of task happens too close to the interval where TaskGo is fetching data from database, the update gets overridden by the previous state that was from the data fetched, hence resulting in a data loss |
 
    Our solution was to make use of Firebase's API and implement a querysnapshot instead of getting data individually. This cut down our read and write operations from 1000 to merely 6 for the same test cases and duration
 
2. Keeping our array sorted in the database
 
    We originally wanted to keep our database sorted by deadline and insert our task using binary search and splicing arrays. However, when we tried to implement our sort function according to other criterias, we realised that the sorting no longer becomes meaningful since the index of the task is never fixed. 
 
    Our fix to this issue was to use a variable in Firestore to remember the current criteria used to sort the array. Task insertion no longer uses binary search through the sorted array, instead it uses JS array method after every addition of task.
 
3. Filtering Tasks
 
    Task filter works in a way that it removes the data that are not required by users. This would mean that some tasks would no longer be stored in the array if we used the JS filter function. As such, we kept 2 copies of the array: task array containing all tasks, display array containing the tasks that we want to display. When we attempted this solution, editing and toggling tasks became a problem as we no longer have information of the index of the task in the task array. 
 
    Our fix was to map the task object as well as the index of the task in the original array onto the display array, giving us a way to link back to its original position.
 
### Lessons Learnt
We have come across numerous bugs along our Orbital journey. However, we would like to highlight some of the more rewarding lessons learnt when these bugs were solved.
1. Usage of "console.log". 
    - Very helpful in showing the order of execution, the values of certain fields, and whether some lines are being read, or skipped.
    - Almost 100% of our bugs are being solved with the help of "console.log".
2. Asynchronous functions.
    - There are often times when things do not update immediately, and as a result, we run into numerous errors, and bugs.
    - We learnt that React Hooks and set states are asynchronous, while components are often rendered before states are being updated. This became an issue when we realised that many of our variables are undefined on the initial render, thus causing runtime errors.
 
 

