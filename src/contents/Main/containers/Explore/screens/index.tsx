/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { } from 'react';
import { connect } from 'react-redux';
import {
  QuickView,
  Text,
  Container,
  Header,
  ButtonGroup,
  FlatList,
  Image,
} from '@components';
import Carousel from 'react-native-snap-carousel';
import {
  Icon, withTheme,
} from 'react-native-elements';
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {
  TouchableOpacity,
} from 'react-native-gesture-handler';
import NavigationService from '@utils/navigation';
import { stringifyQuery, TQuery } from '@utils/redux';
import { applyArraySelector, parseArraySelector } from '@utils/selector';
import { compose } from 'recompose';
import FastImage from 'react-native-fast-image';
import exploreStack from '../routes';
import { jobGetList } from '../redux/slice';
import { jobListSelector } from '../redux/selector';
import { fetchAllJobs } from '../redux/api';
import { renderListJob } from '../../MyJobs/containers/screens/ViewScreen';
import { setCurrentTag, setIndex, setPage } from '@src/redux/tags/tagsSlice';

interface Props {
  list: any;
  getList: (query?: TQuery) => any;
  setCurrentTag: (tag: any) => any;
  setIndex: (index: number) => any;
  setPage: (page: number) => any;
}
const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: 200,
    marginLeft: 60,
    marginRight: 60,
  },
  imageContainer: {
    flex: 1,
    maxHeight: 150,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    width: screenWidth - 60,
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  containerSearch: {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 5,
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    justifyContent: 'center',
    height: 50,
  },
  imageStyle: {
    flex: 1,
    height: 550,
    resizeMode: 'cover',
  },
  listItem: {
    backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
});

const titleList = [
  'All',
  'Mobile',
  'Full stack',
  'Backend',
  'Frontend',
  'Engineer',
  // 'See more',
];

interface State {
  slider1ActiveSlide: number;
  search: string;
  // page: number;
  listPopularJob: Array<any>;
  bookmarks: any;
  category: any;
  // navigation: any;
}
interface Props {
  list: any;
  currentTag: any;
  index: number;
  page: number;
}

class ExploreScreen extends React.Component<Props, State> {
  buttonGroup: any;

  iconRef: any;
  onEndReachedCalledDuringMomentum: boolean;

  constructor(props: any) {
    super(props);
    this.state = {
      slider1ActiveSlide: 1,
      search: '',
      // page: 1,
      listPopularJob: [],
      bookmarks: [],
      category: '',

    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  async componentDidMount() {
    const { getList } = this.props;
    await getList({});
    const getPopularJob = await fetchAllJobs(stringifyQuery({}));
    this.setState({ listPopularJob: getPopularJob.data.data });
  }

  onItemPress = (index: number) => {
    const { getList, setCurrentTag, setIndex, setPage } = this.props;
    if (index === 0) {
      getList({});
      setCurrentTag({ name: '', id: '' })
      this.setState({ category: '' });
      setPage(1);
      setIndex(index);
    }
    else {
      const payload: TQuery = {
        s: { name: { $contL: titleList[index] } },
        limit: 10,
      };
      getList(payload);
      setCurrentTag({ name: '', id: '' });
      this.setState({ category: titleList[index] });
      setPage(1);
      setIndex(index);
    }
  };

  loadMoreData = () => {
    const { getList } = this.props;

    const payload: TQuery = {
      limit: 10,
      page: this.props.page + 1,
      s: {
        name: { $contL: this.state.category },
        ...(this.props.currentTag.id && { $and: [{ 'tags.id': this.props.currentTag.id }] })
      },

    };
    getList(payload);
    // if (!this.props.currentTag.id) 
    setPage(this.props.page + 1);
  };

  renderItem = (
    { item }: { item: any; },
    // parallaxProps: any,
  ) => (
    <TouchableOpacity
      onPress={() => {
        NavigationService.navigate('JobDetailScreen',
          { jobId: item.id });
      }}
    >
      <FastImage
        style={{ height: 200 }}
        source={{
          uri: item.introImg,
          headers: { Authorization: 'someAuthToken' },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <QuickView
        row
        position="absolute"
        bottom={0}
        center
        style={{ zIndex: 999 }}
      >
        <QuickView flex={4}>
          <Text color="#fff" fontSize={20} fontWeight="bold">
            {item.name}
          </Text>
          <Text color="#fff">{item.user?.profile.name}</Text>
        </QuickView>
      </QuickView>
    </TouchableOpacity>
  );

  renderCenterComponent = () => (
    <QuickView row>
      <Text color="#ffffff" fontSize={20}>
        Vietnam
      </Text>
      <Text marginLeft={5} fontWeight="bold" color="#ffffff" fontSize={20}>
        works
      </Text>
    </QuickView>
  );

  renderRightComponent = () => (
    <QuickView row alignItems="center">
      <Icon
        type="antdesign"
        name="search1"
        color="#fff"
        onPress={() => {
          NavigationService.navigate(exploreStack.searchScreen)
        }}
      />
    </QuickView>
  );

  onEndReached = ({ distanceFromEnd }) => {
    if (!this.onEndReachedCalledDuringMomentum) {
      this.loadMoreData();
      this.onEndReachedCalledDuringMomentum = true;
    }
  }
  render() {
    const {
      listPopularJob,
      bookmarks,
    } = this.state;
    const {
      list: { data, loading },
    } = this.props;
    data.map((job: any) => {
      if (
        !bookmarks.find((bookmark: any) => bookmark == job.id)
        && job.isFavorite
      ) {
        bookmarks.push(job.id);
      }
    });

    return (
      <Container>
        <StatusBar backgroundColor="transparent" />
        <ImageBackground
          style={styles.imageStyle}
          source={{
            uri:
              'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
          }}
        >
          <Header
            // backIcon
            title="Explore Jobs"
            // height={100}
            rightComponent={this.renderRightComponent()}
          />
          <QuickView
            style={{ backgroundColor: '#fff' }}
            borderTopLeftRadius={5}
            borderTopRightRadius={5}
          >
            <QuickView />
            <QuickView row marginTop={15} paddingHorizontal={20}>
              <QuickView flex={6}>
                <Text color="#707070" fontFamily="GothamRoundedBold">
                  {/* Top Companies */}
                  Tag: {this.props.currentTag.name}
                </Text>
              </QuickView>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  NavigationService.navigate(exploreStack.selectCateScreen);
                }}
              >
                <Icon type="material" name="tune" color="#707070" />
              </TouchableOpacity>
            </QuickView>
            <QuickView>
              <ButtonGroup
                activeIndex={this.props.index}
                marginHorizontal={15}
                ref={(ref: any) => {
                  this.buttonGroup = ref;
                }}
                titleList={titleList}
                onItemPress={this.onItemPress}
                defaultActiveIndex={0}
                propsChange={false}
                outline={false}
                activeBackgroundColor="#9EB6FF"
                backgroundColor="#FFFF"
                titleColor="#707070"
                activeTitleColor="#FFF"
              />
            </QuickView>
          </QuickView>

          <FlatList
            onEndReached={this.onEndReached.bind(this)}
            // onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => { this.onItemPress(this.props.index) }}
              />
            }
            data={data}
            renderItem={renderListJob}
            // onEndReached={this.loadMoreData}
            ListHeaderComponent={() => (
              <Carousel
                containerCustomStyle={{ backgroundColor: '#fff' }}
                vertical={false}
                sliderWidth={screenWidth}
                loop
                slideStyle={{ width: screenWidth - 30, zIndex: 3 }}
                itemWidth={screenWidth - 120}
                data={listPopularJob}
                renderItem={this.renderItem}
              />
            )}
            onEndReachedThreshold={0}
            ListFooterComponent={() => {
              const { list } = this.props;
              if (list.loading) {
                return (
                  <QuickView style={{ flex: 1, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ff6a00" />
                  </QuickView>
                );
              }
              return <></>;
            }}
          />
          {/* {data.length > 0 ? null : (
            <QuickView
              backgroundColor="#fff"
              flex={1}
              alignItems="center"
              justifyContent="center"
            >
              <Image
                source={{
                  uri:
                    'https://www.startupindia.gov.in/content/dam/invest-india/Blogs/404.PNG',
                }}
                style={{ width: '100%' }}
              />
              <QuickView>
                <Text
                  style={{
                    paddingHorizontal: 80,
                    textAlign: 'center',
                    color: '#000',
                  }}
                  bold
                >
                  We have not found jobs for this search at the moment
                </Text>
              </QuickView>
            </QuickView>
          )} */}
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  list: parseArraySelector(applyArraySelector(jobListSelector, state)),
  currentTag: state.tags.currentTag,
  index: state.tags.index,
  page: state.tags.page
});

const mapDispatchToProps = (dispatch: any) => ({
  getList: (query?: TQuery) => dispatch(jobGetList({ query })),
  setCurrentTag: (tag: any) => dispatch(setCurrentTag(tag)),
  setIndex: (index: number) => dispatch(setIndex(index)),
  setPage: (page: number) => dispatch(setPage(page))
});

const withReduce = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});
// export default connect(mapStateToProps, mapDispatchToProps, null, {
//   forwardRef: true,
// })(ExploreScreen);
export default compose(withTheme, withReduce)(ExploreScreen as any);
