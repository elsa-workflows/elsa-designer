import {Component, Element, Prop, State, Method, Event, EventEmitter, Host, h} from '@stencil/core';
import {ActivityDescriptor} from "../../models";
import {Container} from "inversify";
import {ActivityDriver} from "../../services";

@Component({
  tag: 'elsa-activity-picker',
  scoped: true
})
export class ActivityPicker {

  private modal: HTMLBsModalElement;

  @Element() el: HTMLElement;

  @Prop() container: Container;
  @Prop() activityDescriptors: Array<ActivityDescriptor> = [];
  @Prop({attribute: 'show-modal', reflect: true}) showModal: boolean;

  @State() filterText: string = '';
  @State() selectedCategory: string = null;

  @Event({eventName: 'hidden'}) hiddenEvent: EventEmitter;
  @Event({eventName: 'activity-selected'}) activitySelectedEvent: EventEmitter;

  componentDidRender() {
    if (!!this.modal) {
      this.modal.removeEventListener('hidden.bs.modal', this.emitHiddenEvent);
      this.modal.addEventListener('hidden.bs.modal', this.emitHiddenEvent);
    }
  }

  private emitHiddenEvent = () => this.hiddenEvent.emit();

  private onFilterTextChanged = (e: Event) => {
    const filterField = e.target as HTMLInputElement;
    this.filterText = filterField.value;
  };

  private selectCategory = (category: string) => this.selectedCategory = category;

  private onActivitySelectClick = (e: Event, activity: ActivityDescriptor) => {
    e.preventDefault();
    this.showModal = false;
    this.activitySelectedEvent.emit(activity);
  };

  private onCategoryClick = (e: MouseEvent, category: string) => {
    e.preventDefault();
    this.selectCategory(category);
  };

  private renderActivity = (activity: ActivityDescriptor) => {
    const icon = activity.icon || 'fas fa-cog';
    const iconClass = `${icon} mr-1`;
    return (
      <div class="card" style={{width: '18rem;'}}>
        <div class="card-body">
          <h4 class="card-title"><i class={iconClass}/>{activity.displayName}</h4>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" onClick={e => this.selectCategory(activity.category)}>
            <span class="badge badge-light">{activity.category}</span>
          </a>
        </div>
        <div class="card-footer text-muted">
          <a class="btn btn-primary btn-sm" href="#" onClick={e => this.onActivitySelectClick(e, activity)}>Select</a>
        </div>
      </div>
    );
  };

  render() {
    let activities = this.activityDescriptors;
    const categories: string[] = [null, ...new Set(activities.map(x => x.category))];
    const filterText = (this.filterText || '').toLowerCase();
    const selectedCategory = this.selectedCategory;

    if (!!selectedCategory)
      activities = activities.filter(x => x.category.toLowerCase() === selectedCategory.toLowerCase());

    if (!!filterText)
      activities = activities.filter(x => x.displayName.toLowerCase().includes(filterText) || x.category.toLowerCase().includes(filterText));

    return (
      <div>
        <bs-modal class="modal" tabindex="-1" role="dialog" aria-hidden="true" showModal={this.showModal} ref={el => this.modal = el}>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Available Activities</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-sm-3 col-md-3 col-lg-2">
                    <div class="form-group">
                      <input type="text" value={filterText} class="form-control" placeholder="Filter" aria-label="Filter" autofocus onKeyUp={this.onFilterTextChanged} onChange={this.onFilterTextChanged}/>
                    </div>
                    <ul class="nav nav-pills flex-column activity-picker-categories">
                      {categories.map(category => {
                        const categoryDisplayText = category || 'All';
                        const isSelected = category === this.selectedCategory;
                        const classes = {'nav-link': true, 'active': isSelected};

                        return (
                          <li class="nav-item">
                            <a class={classes} href="#" data-toggle="pill" onClick={e => this.onCategoryClick(e, category)}>{categoryDisplayText}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div class="col-sm-9 col-md-9 col-lg-10">
                    <div class="card-columns tab-content">
                      {activities.map(this.renderActivity)}
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </bs-modal>
      </div>
    )
  }
}
