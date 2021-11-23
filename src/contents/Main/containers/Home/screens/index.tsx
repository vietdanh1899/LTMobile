/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  QuickView,
  Text,
  Container,
  Header,
  Body,
  ParallaxScrollView,
  Avatar,
  FlatList,
  Button,
} from '@components';
import { Icon, Divider, Image } from 'react-native-elements';
import { Dimensions, StyleSheet, StatusBar } from 'react-native';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { applyObjectSelector } from '@utils/selector';
import { loginSelector } from '@contents/Auth/containers/Index/Login/redux/selector';
import { TObjectRedux } from '@utils/redux';
import { Global } from '@utils/appHelper';
import { url } from 'inspector';
import NavigationService from '@utils/navigation';
import NotificationStack from '@contents/Notification/index.stack';
import notificationStack from '@contents/Notification/routes';
import rootStack from '@contents/routes';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#5864ec',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    height: 80,
  },
  listItem: {
    borderRadius: 9,
    backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,

    marginTop: 20,
  },
  articleContent: {
    borderBottomColor: '#d9d9d9',
    borderWidth: 2,
    paddingBottom: 30,
    opacity: 0.7,
    borderRadius: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  },
  tagStyle: {},
  listJob: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    marginHorizontal: 5,
    marginTop: 0,
    width: screenWidth - 60,
  },
});
interface Article {
  title: string;
  content: string;
  image: string;
  avatar: string;
  name: string;
}

interface JobType {
  address: string;
  name: string;
  profileURl: string;
  salary: string;
  deadline: string;
}

interface Props {
  requireLogin?: boolean;
  loginSelectorData: TObjectRedux;
  navigation?: any;
}
const jobData = [
  {
    address: '422 Hoang Minh Khai, Hai Ba Trung',
    name: 'Nhan vien kinh doanh phat trien thi truong',
    profileURl:
      'https://nhanlucnganhluat.vn/uploads/images/6AF28656/logo/2019-02/logo.png',
    salary: '6-9 trieu VND',
    deadline: '11/12/2020',
  },
  {
    address: 'Lo 2/227 Toa MobilePhone Duong 2 thang 9',
    name: 'Lap trinh Android & IOS',
    profileURl:
      'https://pbs.twimg.com/profile_images/732571226992873472/1dn5bkoL.jpg',
    salary: '12-15 trieu VND',
    deadline: '11/12/2020',
  },
];
const articleData = [
  {
    title: '7 bed and breakfasts in Mountain View you wil love',
    content: 'Bi quyet tang doanh so bang email Marketing',
    name: 'Datahouse Asia',
    avatar:
      'data:image/png;base64,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',
    image:
      'https://nld.mediacdn.vn/2020/1/9/viec-lam-them-tet-1578534654256464085693.jpg',
  },
  {
    name: 'Sun* Inc',
    title: 'Is Developing Software in Vietnam Advantageous',
    content: 'Bi quyet tang doanh so bang email Marketing',
    avatar:
      'https://www.topratedfirms.co/wp-content/uploads/cache/images/KMS-Technology/KMS-Technology-2707210261.jpg',
    image:
      'https://storage.googleapis.com/shopdunk-images/vieclamshopdunk/2019/10/f8448b3a-viec-lam-them-tai-nha-0.jpg',
  },
];
class ApplicantScreens extends PureComponent<Props> {
  renderCenterComponent = () => (
    <QuickView row alignItems="center" marginTop={10}>
      <Text fontSize={18} color="#fff" fontFamily="RobotoBold">IT</Text>
      <QuickView backgroundColor="#fff" borderRadius={20} height={38} width={38}>
        <Image
          source={{ uri: 'https://pics.freeicons.io/uploads/icons/png/7167593101582994867-512.png' }}
          style={{ width: 40, height: 40 }}
        />
      </QuickView>
    </QuickView>
  );

  renderListJobs = ({ item }: { item: JobType }) => (
    <QuickView style={styles.listJob}>
      <QuickView>
        <Image
          source={{
            uri:
              'https://www.chotot.com/kinhnghiem/wp-content/uploads/2020/06/cho-tot-viec-lam.jpg',
          }}
          style={{ height: 100, width: '100%' }}
        />
      </QuickView>
      <QuickView marginTop={10} paddingBottom={10}>
        <Text fontSize={20} color="#1f4780" fontWeight="bold" numberOfLines={1}>
          {item.name}
        </Text>
        <QuickView row marginTop={10}>
          <QuickView row alignItems="center">
            <Icon name="eye" type="antdesign" size={16} color="#696862" />
            <Text color="#82817f" marginLeft={5} fontSize={12}>
              5 luot xem
            </Text>
          </QuickView>
          <QuickView row alignItems="center" marginLeft={10}>
            <Icon
              name="checkcircleo"
              type="antdesign"
              size={15}
              color="#696862"
            />
            <QuickView>
              <Text color="#82817f" marginLeft={5} fontSize={12}>
                2 ứng tuyển
              </Text>
            </QuickView>
          </QuickView>
        </QuickView>
        <QuickView marginTop={8}>
          <Text color="#f5502f" fontWeight="bold">
            {item.salary}
          </Text>
        </QuickView>
        <QuickView marginTop={5}>
          <Text color="#3d3a3a" fontWeight="bold" numberOfLines={1}>
            {item.address}
          </Text>
        </QuickView>
        <QuickView row alignItems="center" marginTop={10}>
          <Icon
            name="md-location-outline"
            type="ionicon"
            size={16}
            color="#696862"
          />
          <Text color="#82817f" marginLeft={5} fontSize={12}>
            Cách bạn hơn 100km
          </Text>
        </QuickView>
      </QuickView>
    </QuickView>
  );

  renderListArticle = ({ item }: { item: Article }) => (
    <QuickView style={styles.listItem}>
      <QuickView row>
        <QuickView>
          <Avatar
            rounded
            size="small"
            title="MD"
            source={{ uri: item.avatar }}
          />
        </QuickView>
        <QuickView marginLeft={10}>
          <Text color="#3d3c3b" fontSize={16} fontFamily="LatoBold">
            {item.name}
          </Text>
          <Text color="#82817f">2 hours ago</Text>
        </QuickView>
      </QuickView>
      <TouchableWithoutFeedback style={{ marginTop: 10 }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 200 }}
        />
        <QuickView style={styles.articleContent}>
          <Text color="#333231" fontWeight="bold" fontSize={14} marginTop={5}>
            {item.title}
          </Text>
          <Text marginTop={10} color="#636261" style={{ opacity: 0.7 }}>
            {item.content}
          </Text>
        </QuickView>
        <QuickView row marginTop={20}>
          <QuickView flex={5}>
            <QuickView>
              <Button
                title="BackToOffice"
                height={20}
                fontSize={12}
                width={100}
              />
            </QuickView>
          </QuickView>
          <QuickView row flex={3} justifyContent="space-around">
            <QuickView row>
              <Icon name="hearto" type="antdesign" color="#636261" />
              <Text color="#636261" marginLeft={5}>
                122
              </Text>
            </QuickView>
            <QuickView row>
              <Icon name="comment" type="fontisto" color="#636261" />
              <Text color="#636261" marginLeft={5}>
                15
              </Text>
            </QuickView>
          </QuickView>
        </QuickView>
      </TouchableWithoutFeedback>
    </QuickView>
  );

  renderRightComponent = () => (
    <QuickView row alignItems="center">
      <TouchableOpacity>
        {/* <Icon type="feather" name="bell" size={16} color="#635f5e" /> */}
      </TouchableOpacity>
      <QuickView marginLeft={10}>
        {/* <Icon type="antdesign" name="search1" color="#635f5e" size={16} /> */}
      </QuickView>
    </QuickView>
  );

  leftComponent = () => {
    const { navigation } = this.props;
    return (
      <Icon
        type="entypo"
        name="menu"
        color="#635f5e"
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    );
  };

  render() {
    const {
      requireLogin,
      loginSelectorData: { data },
      ...otherProps
    } = this.props;
    const { token } = Global;

    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#5864ec" />
        <Header
          containerStyle={styles.headerStyle}
          // title="IT Job"
          // leftComponent={this.leftComponent()}
          centerComponent={this.renderCenterComponent()}

          // rightComponent={this.renderRightComponent()}

        />
        {token ? (
          <ScrollView>
            <QuickView
              marginTop={10}
              backgroundColor="#1f4780"
              paddingTop={5}
              paddingHorizontal={5}
              paddingBottom={10}
            >
              <QuickView
                marginTop={10}
                row
                justifyContent="space-between"
                paddingHorizontal={5}
              >
                <Text fontWeight="bold" color="#fff" fontSize={15}>
                  Việc làm đề xuất cho bạn
                </Text>
                <TouchableOpacity>
                  <Text color="#fff" fontSize={12} underline>
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              </QuickView>
              <QuickView
                marginTop={30}
                alignItems="center"
                justifyContent="space-around"
              >
                <FlatList
                  data={jobData}
                  renderItem={this.renderListJobs}
                  horizontal
                  initialNumToRender={1}
                />
              </QuickView>
            </QuickView>
            <QuickView marginTop={20}>
              <FlatList
                data={articleData}
                renderItem={this.renderListArticle}
              />
            </QuickView>
          </ScrollView>
        ) : (
          <QuickView paddingHorizontal={50}>
            <QuickView
              style={{
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                borderRadius: 10,
                shadowOpacity: 0.36,
                shadowRadius: 6.68,
                elevation: 11,
              }}
            >
              <Image
                source={{
                  uri:
                    'https://www.orangescrum.com/blog/wp-content/uploads/2019/10/6-Reasons-you-should-Adopt-Agile-Project-Management-NOW.jpg',
                }}
                style={{ height: 100 }}
                width={200}
                resizeMode="cover"
              />
              <QuickView paddingHorizontal={10} paddingVertical={20}>
                <Text color="#000">Become an Applicant</Text>
                <Text color="#52504e">
                  When you fill in the registration form, you have mandotary
                  field an optional fields. Mandatory fields will have red
                  asterisc
                </Text>
                {/* <Button title="Login or Register"/> */}
                <TouchableWithoutFeedback
                  onPress={() => {
                    NavigationService.navigate(rootStack.authStack);
                  }}
                >
                  <Text center marginTop={5} color="#4771b5">
                    Login or Register
                  </Text>
                </TouchableWithoutFeedback>
              </QuickView>
            </QuickView>
          </QuickView>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  loginSelectorData: applyObjectSelector(loginSelector, state),
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicantScreens);
