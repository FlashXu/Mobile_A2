# COMP90018 Mobile Computing Systems Programming Assignment 2

## Group-W01/09-1 Members:
* [Minghui Li - 1156921](https://github.com/lmh1993)
* [Yichao Xu - 1045184](https://github.com/FlashXu)
* [Ye Yang - 1087176](https://github.com/Ace2YY)
* [Ruocheng Ning - 1106219](https://github.com/Irrela)
* [Yizi Han - 1045234](https://github.com/YiziH)
* [Jiawei Ren - 1130796](https://github.com/JiaweiRenUBC)

## Google Cloud Instance:
* IP and Port: [http://www.mobileappproj.ml:5984/](http://www.mobileappproj.ml:5984/) or [http://35.220.242.6:5984/](http://35.220.242.6:5984/)  
* Futon Page: [http://www.mobileappproj.ml:5984/_utils/](http://www.mobileappproj.ml:5984/_utils/) 
* Request Respondse URL: http://www.mobileappproj.ml:5000

## Frontend Files (Components)
* `App.js` - App entry.
* `ActivityBody.js` - Activity page.
* `AssignTask.js` - Running project panel.
* `ChooseRoute.js` - Routes choosing panel.
* `FooterMenu.js` - Interface footer.
* `ForgotPassword.js` - Password forgetting page.
* `FreeTraining.js` - Free trainning page.
* `FriendsBody.js` - Friends page.
* `FrontPage.js` - App front page.
* `LogIn.js` - Login page.
* `MainMenuPage.js` - Main menu page.
* `ProfileBody.js` - Profile page.
* `RankingBody.js` - Ranking in friends page.
* `ResetPassword.js` - Reset password page.
* `ShareBody.js` - Share page.
* `SignUp.js` - Sign up page.
* `VerifyEmail.js` - verify email page.

## Backend Files
* `app.py` - Async Flask entry of the database.
* `db_op.py` - Basic control of the database.
* `accounts.py` - Basic control and Flask response of the database "accounts".
* `personal_info.py` - Basic control and Flask response of the database "personal_info".
* `friends_list.py` - Basic control and Flask response of the database "friends_list".
* `online_info.py` - Basic control and Flask response of the database "online_info".
* `running_record.py` - Basic control and Flask response of the database "running_record".
* `moments.py` - Basic control and Flask response of the database "moments".
* `distance.py` - Basic control and Flask response of the database "distance".
* `attachments.py` - Basic control and Flask response of the function attachments.
* `forget_pwd.py` - Basic control and Flask response of the function forget password.
* `python-flask-server-generated` - Swagger API server of the database.
* `db_req_demo.js` - db demo with react native code.
* `db_json_demo.js` - json file upload to/download from db demo with react native code.


## API Files
* [API file: https://app.swaggerhub.com/apis/FlashXu/mobile_http_api/1.0.0](https://app.swaggerhub.com/apis/FlashXu/mobile_http_api/1.0.0)
* [API deployment: http://www.mobileappproj.ml:8080/ui](http://www.mobileappproj.ml:8080/ui)

## Compile and Run the App
* Please install [Node.js and npm.](https://nodejs.org/en/download/)
<br/>
* Installing react native, please run: 
<br/>  `npm install -g react-native-cli`.
<br/>
* Installing expo, please run: 
<br/>  `npm install -g expo-cli`.
<br/>
* Installing dependencies, please locate to the app file and run: 
<br/>  `npm install`.
<br/>
* Starting expo, please run: 
<br/>  `expo start`.
<br/>
* After running `expo start`, the default browser will open a new tab at http://localhost:19002/, where you can click different buttons on the left sidebar to run the app:
<br/>(1) Run on Android device/emulator.
<br/>(2) Run on iOS simulator.
<br/>(3) Run in web browser. (Not suggested, since some functions do not compatible in web.)
<br/>If you have correctly installed corresponding Android or iOS simulator, clicking (1) or (2) will automatically run the app on the simulator. 
<br/>
* To run the app on Android Studio, please install [Android Studio](https://developer.android.com/studio) and virtual devices. For instructions about setting up the android virtual device, please refer to [https://developer.android.com/studio/run/managing-avds](https://developer.android.com/studio/run/managing-avds). By openning your android virtual device in Android Studio, then clicking on 'Run on Android device/emulator', you can run our app on the virtual device. 
<br/>
* To run the app on expo app, please install expo app on your smartphone from APP Store (iOS) or Google Play (Android). By running `expo start`  to start building app on expo and openning expo app on your smartphone, you can test our app on expo app.

