import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SwipeComponent from '../../common/SwipeComponent/SwipeComponent';
import styles from './NewFurniture.module.scss';
import ProductBox from '../../common/ProductBox/ProductBoxContainer';

class NewFurniture extends React.Component {
  state = {
    activePage: 0,
    activeCategory: 'bed',
    fadeTransition: false,
  };

  handlePageChange(newPage) {
    this.setState({
      activePage: newPage,
      fadeTransition: !this.state.fadeTransition,
    });
  }

  handleCategoryChange(newCategory) {
    this.setState({
      activeCategory: newCategory,
      fadeTransition: !this.state.fadeTransition,
    });
  }

  comparedProducts(products, remove) {
    return (
      <div className={styles.comperedContainer}>
        {products.map(({ img, id, name }) => (
          <div key={id} className={styles.productImage}>
            <img src={img} alt={`${name}`} />
            <div className={styles.close} onClick={() => remove(id)}>
              x
            </div>
          </div>
        ))}
        <a href='#'>Compare</a>
        <div className={styles.close} onClick={() => remove()}>
          x
        </div>
      </div>
    );
  }

  handleCategoryFilter(products, categories) {
    let newCategories = [];

    for (const category of categories) {
      for (const product of products) {
        if (category.id === product.category) {
          newCategories.push(category);
          break;
        }
      }
    }
    return newCategories;
  }

  render() {
    const {
      categories,
      products,
      mode,
      allComperedProducts,
      removeFromCompared,
      searchString,
    } = this.props;
    const { activeCategory, activePage } = this.state;

    const categoryProducts = products.filter(item => item.category === activeCategory);
    const pagesCountDesktop = Math.ceil(categoryProducts.length / 8);
    const pagesCountTablet = Math.ceil(categoryProducts.length / 2);
    const pagesCountMobile = Math.ceil(categoryProducts.length);

    const dots = [];
    let pagesCount;
    let productsPerPage;
    if (mode === 'desktop') {
      pagesCount = pagesCountDesktop;
      productsPerPage = 8;
    } else if (mode === 'tablet') {
      pagesCount = pagesCountTablet;
      productsPerPage = 2;
    } else {
      pagesCount = pagesCountMobile;
      productsPerPage = 1;
    }

    for (let i = 0; i < pagesCount; i++) {
      dots.push(
        <li>
          <a
            onClick={() => this.handlePageChange(i)}
            className={i === activePage && styles.active}
          >
            page {i}
          </a>
        </li>
      );
    }

    return (
      <SwipeComponent
        rightAction={() => this.handlePageChange(activePage > 0 ? activePage - 1 : 0)}
        leftAction={() =>
          this.handlePageChange(
            activePage + 1 < pagesCount ? activePage + 1 : activePage
          )
        }
      >
        <div className={styles.root}>
          <div className='container'>
            {allComperedProducts.length &&
              this.comparedProducts(allComperedProducts, removeFromCompared)}
            <div className={styles.panelBar}>
              <div className='row no-gutters align-items-end'>
                <div className={styles.heading}>
                  {searchString ? (
                    <h3>Search results ({products.length})</h3>
                  ) : (
                    <h3>New furniture</h3>
                  )}
                </div>
                <div className={'col ' + styles.menu}>
                  <ul>
                    {this.handleCategoryFilter(products, categories).map(item => (
                      <li key={item.id}>
                        <a
                          className={item.id === activeCategory && styles.active}
                          onClick={() => this.handleCategoryChange(item.id)}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={
                    mode === 'tablet' || mode === 'mobile'
                      ? styles.centerDots
                      : `col-auto ${styles.dotsOnRight}`
                  }
                >
                  <ul className={styles.dots}>{dots}</ul>
                </div>
              </div>
            </div>
            <TransitionGroup component='div' className='row'>
              {categoryProducts
                .slice(activePage * productsPerPage, (activePage + 1) * productsPerPage)
                .map(item => (
                  <CSSTransition
                    key={item.id}
                    timeout={300}
                    appear={true}
                    classNames={{
                      appear: styles.fadeAppear,
                      appearActive: styles.fadeAppearActive,
                      enter: styles.fadeEnter,
                      enterActive: styles.fadeEnterActive,
                      exit: styles.fadeExit,
                      exitActive: styles.fadeExitActive,
                    }}
                  >
                    <div key={item.id} className='col-lg-3 col-md-6 col-sm-12'>
                      <ProductBox {...item} />
                    </div>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          </div>
        </div>
      </SwipeComponent>
    );
  }
}

NewFurniture.propTypes = {
  mode: PropTypes.string,
  children: PropTypes.node,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.number,
      stars: PropTypes.number,
      promo: PropTypes.string,
      newFurniture: PropTypes.bool,
    })
  ),
  allComperedProducts: PropTypes.array,
  removeFromCompared: PropTypes.func,
  searchString: PropTypes.string,
  selectedCategory: PropTypes.string,
};

NewFurniture.defaultProps = {
  categories: [],
  products: [],
  allComperedProducts: [],
};

export default NewFurniture;
