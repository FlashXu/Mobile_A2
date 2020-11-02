import React, {Component} from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import * as FileSystem from 'expo-file-system';

class App_frontpage extends Component {

  // 从db_name里的mount_id中获取名字为attachment_name的json附件
  async get_attachments(db_name, mount_id, attachment_name){
    var url = 'http://www.mobileappproj.ml:5000/attachments/' + db_name + '/' + mount_id + '/' + attachment_name;
    var file = await fetch(url, {
      method: 'GET',
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
    return file;
  }

  // 上传json附件到db_name里的mount_id，并起名字为attachment_name
  async upload_attachments(db_name, mount_id, attachment_name){
    var coordinate = [[1, 2], [3, 4], [5, 6], [7, 8]];
    var data = {'coordinate': coordinate}; // JSON obj
    //将 JSON obj转化为blob上传blob
    const str = JSON.stringify(data);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
        type: "application/json;charset=utf-8"
    });
    var url = 'http://www.mobileappproj.ml:5000/attachments/' + db_name + '/' + mount_id + '/' + attachment_name;
    var resp = await fetch(url, {
      method: 'PUT',
      body: blob
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
    return resp;
  }

  // 从db_name里的mount_id中删除名字为attachment_name的json附件
  async delete_attachments(db_name, mount_id, attachment_name){
    var url = 'http://www.mobileappproj.ml:5000/attachments/' + db_name + '/' + mount_id + '/' + attachment_name;
    var resp = await fetch(url, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
    return resp;
  }

  // Request with params. (POST, DELETE and PUT)
  async bodyOperation(url, data, operation){
    var data = await fetch(url,{
      method: operation,
      body: data
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
    });
    return data;
  }

  // Request with params. (Only GET)
  async GET(url){ 
    var data = await fetch(url,{
      method: 'GET'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
    });
    return data;
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>This is an app for testing db link</Text>
        <View style={{flexDirection: 'row', marginTop: 64}}>

          {/* Create a running record.*/}
          <View style={styles.record_btnstyle}>
            <Button 
              title="Post Running Record" 
              onPress = {() => {
                  var data = JSON.stringify({
                    "distance": 7, // 总距离
                    "end_time": "2020-10-19 19:36:00", // 开始时间
                    "start_time": "2020-10-19 18:36:00", // 结束时间
                    "ave_speed": 4, // 平均速度
                    "user_id": "e0d417ff1f38ca508c6145790a065e4d", // 用户id
                    "status": "completed" // 完成情况
                  })
                  var url = 'http://www.mobileappproj.ml:5000/running_record';
                  this.bodyOperation(url, data, 'POST').then((res) => {
                    if(res.resp == 406){
                      alert('Record is already existed!');
                    }else{

                      alert('Success! The generated id is: ' + res.gen_id);
                    }
                  })
                }
              }
            />
          </View>

          {/* Get a running record.*/}
          <View style={styles.record_btnstyle}>
            <Button 
              title="Get Running Record" 
              onPress = {() => {
                  var id = '8398e494e71c319a4e36cb6f7a040cef'; // Record id
                  var url = 'http://www.mobileappproj.ml:5000/running_record?id=' + id;
                  this.GET(url).then((res) => {
                    if(res.resp == 404){
                      alert('There is no such a record');
                    }else{
                      alert(JSON.stringify(res.record_detail));
                    }
                  })
                }
              }
            />
          </View>

          {/* Delete a running record.*/}
          <View style={styles.record_btnstyle}>
            <Button 
              title="Delete Running Record" 
              onPress = {() => {
                  var data = JSON.stringify({
                    "_id": "8398e494e71c319a4e36cb6f7a040cef", // Record id
                  })
                  var url = 'http://www.mobileappproj.ml:5000/running_record';
                  this.bodyOperation(url, data, 'DELETE').then((res) => {
                    if(res.resp == 200){
                      alert('Success!');
                    }else{
                      alert('Error!');
                    }
                  })
                }
              }
            />
          </View>
        </View>


        <View style={{flexDirection: 'row', marginTop: 20}}>
     
          {/* PUT method demo. */}
          <View style={styles.btnstyle}>
            <Button 
              title="PUT" 
              onPress = {() => 
                this.upload_attachments('running_record', 'e0d417ff1f38ca508c6145790a047ca2', 'test.json')
                .then((res) => {
                    // 408说明文件格式错误
                  if(res.resp == 408){
                    alert('The format of the attachment format is wrong!');
                  }else if(res.resp == 404){
                    // 404 说明数据库中不存在对应id的文件
                    alert('There is no such a file!');
                  }else{
                    // 200 成功上传附件
                    alert('Success!');
                  }
                })
              }
            />
          </View>
          
          {/* GET method demo. */}
          <View style={styles.btnstyle}>
            <Button 
            title ="GET" 
            onPress = {() => this.get_attachments('running_record', 'e0d417ff1f38ca508c6145790a047ca2', 'test.json')
                .then((res) => {
                  if(res.hasOwnProperty('resp')){
                    // 有resp 说明返回resp=404
                    alert('There is no such a file!');
                  }else{
                    // 成功返回坐标
                    alert(JSON.stringify(res))
                  }
                })
              }
            />
          </View>

          {/* DELETE method demo. */}
          <View style={styles.btnstyle}>
            <Button 
            title ="DELETE" 
            onPress = {() => this.delete_attachments('running_record', 'e0d417ff1f38ca508c6145790a047ca2', 'test.json')
                .then((res) => {
                  if(res.resp == 404){
                    // 没有这个文件
                    alert('There is no such a file!');
                  }else{
                    // 成功删除附件
                    alert('Success!');
                  }
                })
              }
            />
          </View>
        </View>
      </View> 
    );
  }
}
export default App_frontpage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  record_btnstyle:{
    flex: 1, 
    width:200,
    marginRight:10

  },
  btnstyle:{
    flex: 1, 
    width:70,
    marginRight:10

  }
});
 

