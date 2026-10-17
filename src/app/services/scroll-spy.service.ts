import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

/** Tracks which section is in view so the explorer and tabs highlight the open "file". */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly active$$ = new BehaviorSubject<string>('hero');
  private observer?: IntersectionObserver;

  readonly active$ = this.active$$.pipe(distinctUntilChanged());

  observe(ids: readonly string[]): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) this.zone.run(() => this.active$$.next(visible[0].target.id));
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer!.observe(el);
    });
  }

  goTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.active$$.next(id);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
