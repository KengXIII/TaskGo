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
 
## Team Details
Team ID: #2483

Team Members: Phua Guan Wei & Liao Keng I 

Team Advisor : Guo Ai

Targeted level of achievement: Apollo 11
 
## Introduction
There are so many tasks and assignments to keep track of, given that students have lots of modules to take. Some tasks are repetitive and easy to forget (weekly graded quizzes), while some tasks often take a long time and require students to start early  (weekly labs and problem sets).

TaskGo is a web-based todo-list to help users keep track of all their tasks and provides notification when incomplete tasks are about to be due.
The website that we designed is mainly for NUS students. As such, features like importing calendars from NUSMods are applicable to undergraduates only.

* Insert single and routine tasks
* Create tags that users can assign tasks to
* Priority and Tag sorting
* Email notification for incomplete tasks that are due soon.
 
## User Stories
As a potential TaskGo user, we would want to:
* Access the platform on both desktop and mobile devices, so that we are able to edit the to-do list on any devices that we are comfortable with.
* Be able to look at all the unfinished assignments that we have in an overview page. So that we are able to keep everything concise, and reduce the likelihood of missing out on an important task.
* Be notified before an incomplete task is due soon so that I would forget to work on them.
* Sort our tasks according to their level of priority, so as to facilitate easier and smoother planning, and enhance viewability.
* Sort our tasks according to their level of priority, so as to facilitate easier and smoother planning, and enhance viewability.
* Store our tasks in a “Completion” list, so that we can always refer back to these completed tasks should the time arise.
* Schedule our upcoming tasks on a Calendar so that we can identify time slots that are available, and also sieve out potential scheduling errors.
 
## Scope of Functionalities
### Social login with Google
Personalised to-do list, easily accessible through social login via Google. 
### Task Handling
Users can insert their tasks in TaskGo. There are 2 types of tasks that can be inserted - Regular and Routine. Users are then prompted on information about their tasks. They are:
* Task name
* Task frequency (For routine tasks only)
* Deadline
* Select category 
* Level of priority
Users can also mark their tasks as complete. The complete tasks are then stored under the ‘Completed Tasks’ tab, for up to 7 days by default. Users are able to change this default duration by going under the ‘Settings’ tab.
 
### Task Sorting
The tasks are sorted via a Priority System by default. The tasks in the overview page are then sorted by their priority -- Tasks with the highest priority level are placed at the top of the overview page.
Users can also select to view their tasks, sorted via the deadlines -- Tasks with the closest deadline would be placed at the top of the page.
All tasks are created under a certain category. Users can select which category of task they want to view. By default, the task list shows tasks from all categories. This is to facilitate better viewership, and helps to keep the task list organised. 
 
### In-built calendar
Users are able to work with a calendar to better facilitate their planning. NUS users can start by syncing the calendar with their calendar on NUSMods under the ‘Settings’ tab.
We will have an ‘edit’ toggle, that highlights all the empty blocks available to work on our tasks. Once the ‘edit’ button is hit, the user can select time slots of 1 hour, in which they will be allocating this 1 hour to the tasks that the user had inserted beforehand. In the case where the user wants to allocate more than 1 hour to a task, the user can choose the ‘Multi-select’ function to do so. 
After the user is satisfied with choosing the timeslot, he/she will hit ‘Done’ and a pop-up interface will appear for him/her to select all the tasks that he/she has selected. After the user has selected all the tasks that he/she wants to do within that fixed timeframe, the calendar will then be updated to include the tasks that the user has selected.
## Tech stack
### Firebase & Firestore
We integrated Google’s Firebase and Firestore into our React web-app. This would allow users to sign up to our service with ease and simplify the login process. At the same time, issues like forgotten passwords can be avoided. Firestore will serve as our database where information like tasks and deadlines will be stored.
### HTML/CSS/JS
The web-page and UI is developed using the ReactJS library and written in JSX. Formatting is done with CSS.
### Vercel
We engaged Vercel as our platform to deploy and host our web-page. The site can be accessed at : https://task-go-kengxiii.vercel.app/ 
 
 ## Visuals
### Program Flow
![1231 1](https://user-images.githubusercontent.com/77228324/120111688-7f091b80-c1a5-11eb-9674-a49c9dd85bb3.png)

### Examples of use
* Accessing our homepage
![Homepage](https://user-images.githubusercontent.com/77228324/120111294-f3db5600-c1a3-11eb-9e1e-95d5d39f34d9.png)

* TaskGo Dashboard
![Dashboard](https://user-images.githubusercontent.com/77228324/120111312-048bcc00-c1a4-11eb-8471-5b2992f210b2.png)

* Adding Tasks
![Add Tasks](https://user-images.githubusercontent.com/77228324/120111325-140b1500-c1a4-11eb-8ab6-5697584056f2.png)
* Task History
![Completed Tasks](https://user-images.githubusercontent.com/77228324/120111337-1f5e4080-c1a4-11eb-8679-323f5db3f42d.png)
* Calendar
 ![Calendar Page](https://user-images.githubusercontent.com/77228324/120111352-300eb680-c1a4-11eb-8874-c3412cad3786.png)
* Settings
![Settings](https://user-images.githubusercontent.com/77228324/120111362-3735c480-c1a4-11eb-81be-ff283a45af71.png)
 
## Comparison with similar platforms
TaskGo is a web-based to-do list that is designed to help our users to keep track of their routine and ad-hoc work in a clear and concise web application. The task can be modified and added according to the user's needs. As such, users would be able to experience flexibility in customising their own schedules. 
### NUSMods
NUSMods simply provides the users with the general lesson schedule. However, more can be done on the scheduling side, as students are unable to add in their own homework schedules into the calendar. 
### LumiNUS
LumiNUS highlights the due dates of important submissions / tests, as entered by NUS Module Coordinators. However, some of these dates may not be accurate, and students themselves are unable to make edits and improvements onto such scheduling functionalities.
 
## Project Status
We are working on the basic Create-Read-Update-Delete (CRUD) functionalities of a to-do list. Features that we intend to roll out in the next phase of the development includes a working backend server to handle notifications to users with tasks nearing deadline via Email, and an inbuilt-calendar to assist users to find available time amidst the busy schedule for their tasks.

