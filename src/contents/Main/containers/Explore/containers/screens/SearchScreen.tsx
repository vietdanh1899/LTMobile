import {
  Container,
  FlatList,
  Header,
  QuickView,
  Text,
} from '@components';
import { TQuery } from '@utils/redux';
import React, { PureComponent } from 'react';
import { Dimensions, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { applyArraySelector, parseArraySelector } from '@utils/selector';
import { jobListSearchSelector } from '../../redux/selector';
import { jobGetListSearch } from '../../redux/slice';
import { RootState } from '@src/redux/reducers';
import { renderListJob } from '@contents/Main/containers/MyJobs/containers/screens/ViewScreen';

const screenWidth = Math.round(Dimensions.get('window').width);

interface Props {
  getListSearch: any;
  list: any;
}

interface State {
  search: string;
  bookmarks: any;
  page: number;
}

class SearchScreen extends PureComponent<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      search: '',
      bookmarks: [],
      page: 1,
    };
  }

  renderCenterComponent = () => {
    const { search } = this.state;
    return (
      <SearchBar
        containerStyle={{
          borderRadius: 10,
          width: screenWidth - 20,
          height: 40,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: '#d8d4dc',
        }}
        inputStyle={{ fontSize: 14 }}
        placeholder="Type Here ..."
        platform="android"
        clearIcon
        returnKeyType="search"
        onChangeText={(text) => { this.setState({ search: text }) }}
        value={search}
        searchIcon
        placeholderTextColor="black"
        cancelIcon
        onSubmitEditing={() => this.sendSearchRequest(this.state.search)}
      />
    );
  };

  sendSearchRequest = (payload: any) => {
    const { getListSearch } = this.props;
    const objectFilter: any = [];
    objectFilter.push({ name: { $contL: payload } });
    // objectFilter.push({ lowestWage: { $eq: payload } });
    // objectFilter.push({ highestWage: { $eq: payload } });
    objectFilter.push({ 'categories.name': { $contL: payload } });
    objectFilter.push({ 'user.profile.name': { $contL: payload } });
    objectFilter.push({ 'address.description': { $contL: payload } });
    const s = {
      $or: objectFilter,
    };
    getListSearch({ s });
  };

  loadMoreData = () => {
    const { getListSearch } = this.props;
    const { page } = this.state;
    this.setState({ page: page + 1 });
    const objectFilter: any = [];
    objectFilter.push({ name: { $contL: this.state.search } });
    // objectFilter.push({ lowestWage: { $eq: payload } });
    // objectFilter.push({ highestWage: { $eq: payload } });
    objectFilter.push({ 'categories.name': { $contL: this.state.search } });
    objectFilter.push({ 'user.profile.name': { $contL: this.state.search } });
    objectFilter.push({ 'address.description': { $contL: this.state.search } });
    const s = {
      $or: objectFilter,
    };
    const payload: TQuery = {
      s,
      limit: 10,
      page,
    };
    getListSearch(payload);
  };

  render() {
    const {
      list: { data, metadata, loading },
    } = this.props;
    return (
      <Container>
        <StatusBar backgroundColor="transparent" />
        <Header
          backIcon
          title="Job search"
          // height={100}
        />
        <QuickView backgroundColor="white" height={80} justifyContent="center" shadow>
          {this.renderCenterComponent()}
          <Text fontSize={14} color="black" marginLeft={20}>
            {metadata.total}
            {' '}
            jobs matched
          </Text>
        </QuickView>

        <QuickView alignItems="center" flex={1}>
          {/* <ActivityIndicator animating={loading} size='large'/> */}
          <FlatList
            data={data}
            renderItem={renderListJob}
            onEndReached={this.loadMoreData}
            contentContainerStyle={{ flexGrow: 0 }}
            refreshControl={
              <RefreshControl
                size={0}
                refreshing={loading}
                onRefresh={() => this.sendSearchRequest(this.state.search)}
              />
            }
          />
        </QuickView>

      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  list: parseArraySelector(applyArraySelector(jobListSearchSelector, state)),
});

const mapDispatchToProps = (dispatch: any) => ({
  getListSearch: (query?: TQuery) => dispatch(jobGetListSearch({ query })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchScreen as any);
