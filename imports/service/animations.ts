import { trigger,
        state,
        style,
        animate,
        transition,
        query,
        stagger,
        keyframes } from '@angular/animations';

export const flyin = [
  trigger('flyin', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate('700ms ease-in')
      ])
    ])
];

export const slideInOut = [
    trigger('slideInOut', [
      state('in', style({
        // overflow: 'hidden',
        height: '*',
        width: '*'
      })),
      state('out', style({
        opacity: '0',
        // overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ])
  ];


export const rotateIn = [
  trigger('rotateIn', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'rotate(-180deg)'}),
        animate('700ms ease-out')
      ])
    ])
];

export const fadeInAnimation = [
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeInAnimation', [
      // route 'enter' transition
      transition(':enter', [
        // css styles at start of transition
        style({ opacity: 0 }),
        // animation and styles at end of transition
        animate(".3s", style({ opacity: 1 }))
      ]),
      transition(":leave", [
        animate(".3s", style({ opacity: 0 }))
      ])
    ])
];

export const cartShowAnimation = [
  trigger('cartShowAnimation', [
    state('show', style({
        transform: 'translate3d(0, 0, 0)'
        // width: '0'
    })),
    state('hide', style({
        transform: 'translate3d(100%, 0, 0)'
        // width: '28vw'
    })),
    transition('hide => show', animate('400ms ease-in-out')),
    transition('show => hide', animate('400ms ease-in-out'))
  ]),
];

export const flyFromBottom = [
  trigger('flyFromBottom', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(100%)'}),
        animate('700ms ease-in')
      ])
    ])
];

export const flyFromTop = [
  trigger('flyFromTop', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(-100%)'}),
        animate('300ms ease-in')
      ])
    ])
];

export const wobbleIn = [
   trigger('wobbleIn', [

      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
   ])
 ];

 export const list1 = [
   trigger('list1', [
     state('in', style({
       opacity: 1,
       transform: 'translateX(0)'
     })),
     transition('void => *', [
       style({
         opacity: 0,
         transform: 'translateX(-100px)'
       }),
       animate(300)
     ]),
     transition('* => void', [
       animate(300, style({
         transform: 'translateX(100px)',
         opacity: 0
       }))
     ])
   ]),
 ];

export const flyItems = [
  trigger('flyItems', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      animate(700, keyframes([
        style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(500, keyframes([
        style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
        style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
      ]))
    ])
  ])
];
