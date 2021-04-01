import React from 'react';
import { connect } from 'dva';
import { Upload, Icon, Modal } from 'antd';

import { print } from '../../utils/utils';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class UploadFile extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    progress: 0,
    
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  deleteFile = (file) => {
    const fileMd5 = file['uid'];
    const { dispatch } = this.props;
    dispatch({
      type: "uploadFiles/deleteFile",
      payload: {
        fileMd5,
      }
    })
  }

  uploadImage = options => {
    const { file, onProgress } = options;
    print("file info: ", file);
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data", "accept": "*/*", "X-Requested-With": "XMLHttpRequest" },
      onUploadProgress: event => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        this.setState({ progress: percent })
        if (percent === 100) {
          setTimeout(() => this.setState({ progress: 0 }), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    };
    fmData.append("file", file);
    const { dispatch } = this.props;
    dispatch({
      type: "uploadFiles/uploadFile",
      payload: {
        formData: fmData,
        config,
      }
    })
  };


  
  render() {
    const { fileInfoList } = this.props;
    print("debug: ", fileInfoList);
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          // action='/api/uploadFile'
          listType="picture-card"
          fileList={fileInfoList}
          onPreview={this.handlePreview}
          onRemove={file => this.deleteFile(file)}
          customRequest={this.uploadImage}
        >
          {fileInfoList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fileInfoList } = state.uploadFiles;
  return {
      fileInfoList,
  }
}

export default connect(mapStateToProps)(UploadFile);