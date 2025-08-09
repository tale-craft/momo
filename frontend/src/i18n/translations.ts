// frontend/src/i18n/translations.ts
export const resources = {
  en: {
    translation: {
      // 通用
      common: {
        loading: "Loading...",
        error: "Error",
        save: "Save",
        saveChanges: "Save Changes",
        cancel: "Cancel",
        submit: "Submit",
        submitQuestion: "Submit Question",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        success: "Success",
        confirmDelete: "Are you sure you want to delete this?",
        anonymous: "Anonymous",
        aStranger: "a stranger",
        you: "You",
        questions: "questions",
        copy: "Copy",
        copied: "Copied!",
        goBack: "Go Back",
      },

      // 导航与主题
      nav: {
        home: "Home",
        inbox: "Inbox",
        bottles: "Bottles",
        myBoard: "My Board",
        settings: "Settings",
        signIn: "Sign In / Sign Up",
        signOut: "Sign Out",
        theme: "Theme",
        themeLight: "Light",
        themeDark: "Dark",
        themeSystem: "System",
      },

      // 认证
      auth: {
        finalizingSession: "Finalizing your session...",
      },

      // 首页
      home: {
        title: "momo",
        subtitle: "A whisper in the ocean, a question in the void.",
        description: "Connect anonymously, speak freely.",
        createBoard: "Create Your Board",
        enterOcean: "Enter the Ocean",
        latestQA: "LATEST PUBLIC Q&A",
        noQuestions: "No public questions yet.",
        shareBoard: {
          title: "Your Personal Board",
          description:
            "Share your link to receive anonymous questions from friends.",
          copyLink: "Copy Link",
          setupPrompt: "You haven't set up your personal board yet.",
          setupButton: "Go to Settings",
        },
      },

      // 收件箱
      inbox: {
        title: "My Inbox",
        stats: "Stats",
        total: "Total Questions",
        pending: "Pending",
        answered: "Answered",
        private: "Private",
        filterAll: "All",
        filterPending: "Pending",
        filterAnswered: "Answered",
        noQuestions: "Your inbox is empty.",
        answer: "Answer",
        answerModalTitle: "Answer Question",
      },

      // 个人主页
      profile: {
        noQuestions: "No questions yet.",
        beFirstToAsk: "Be the first to ask!",
      },

      // 问题相关
      question: {
        ask: "Ask a question",
        placeholder: "What's on your mind? Ask @{{handle}} anything...",
        private: "Ask Privately",
        privateHint: "Sign in to ask privately and get notified of answers.",
        privateHintSignIn: "Sign in",
        privateHintRemainder: " to ask privately and get notified of answers.",
        answer: {
          placeholder: "Write your answer here...",
          success: "Answer posted successfully",
          waiting: "Waiting for answer",
          waitingPrompt: "You have a new question waiting for an answer.",
        },
        status: {
          answered: "Answered",
          pending: "Pending",
          private: "PRIVATE",
        },
        pageTitle: "Question Details",
        notFound: "Question not found.",
        accessDenied: "You do not have permission to view this question.",
      },

      // 漂流瓶相关
      bottle: {
        throw: "Throw a Bottle",
        pick: "Pick a Bottle",
        release: "Release Bottle",
        chat: "Chat with {{name}}",
        loadError: "Could not load this conversation.",
        conversationLabel: "Conversation",
        conversations: "My Conversations",
        noConversations: "Your conversation list is empty.",
        startConversation: "Start by throwing or picking up a bottle.",
        throwTitle: "What's on your mind?",
        throwDescription:
          "This message will be sent adrift for a stranger to find.",
        throwPlaceholder: "Write your message here...",
        castToOcean: "Cast into the Ocean",
        ocean: {
          title: "The Ocean of Whispers",
          subtitle:
            "Cast your thoughts into the sea, or find a message meant for you.",
          quietTitle: "The ocean is quiet...",
        },
        message: {
          placeholder: "Type your message...",
          send: "Send",
          sendError: "Error sending message",
        },
        status: {
          floating: "FLOATING",
          picked: "PICKED",
          replied: "REPLIED",
        },
      },

      // 设置页面
      settings: {
        title: "Profile Settings",
        displayName: {
          label: "Display Name",
          placeholder: "Your display name",
          description: "This is your public display name.",
        },
        handle: {
          label: "Handle",
          placeholder: "your_unique_handle",
          description: "This is your unique @handle for your page.",
        },
        avatar: {
          label: "Avatar",
          upload: "Upload new avatar",
          remove: "Remove avatar",
        },
        saveSuccess: "Profile updated successfully!",
        saveError: "Failed to update profile.",
        sharePrompt: {
          description: "Your personal board is ready. Share the link!",
          copy: "Copy Link",
        },
      },

      // 文件上传
      fileUploader: {
        clickToUpload: "Click to upload",
        orDragAndDrop: "or drag and drop",
        fileTypes: "PNG, JPG, GIF up to {{size}}MB",
      },

      // 错误消息
      errors: {
        userNotFound: "User @{{handle}} not found.",
        api: {
          loadFailed: "Failed to load {{resource}}.",
        },
        auth: {
          required: "Authentication required",
          denied: "Access denied",
        },
        validation: {
          required: "This field is required",
          minLength: "Must be at least {{count}} characters",
          maxLength: "Must be less than {{count}} characters",
          invalidHandle:
            "Handle can only contain letters, numbers, and underscores.",
          handleTaken: "This handle is already taken.",
          maxImages: "You can upload up to {{count}} images.",
        },
        upload: {
          failed: "Upload failed",
          invalidType: "Invalid file type",
          tooLarge: "File too large",
          tooLargeTitle: "File too large",
          tooLargeDescription:
            "Please upload an image smaller than {{size}}MB.",
        },
      },

      // 通知消息
      notifications: {
        upload: {
          success: "Image uploaded successfully.",
        },
        question: {
          sent: "Question sent!",
          sentDescription: "You'll be notified when it's answered.",
          received: "You received a new question!",
          answered: "Your question has been answered!",
        },
        bottle: {
          thrown: "Your bottle is now floating in the ocean.",
          picked: "You've picked up a bottle!",
          replied: "New reply in your conversation.",
          released: "Bottle released",
          releasedDescription: "It's back in the ocean.",
        },
      },
    },
  },
  zh: {
    translation: {
      // 通用
      common: {
        loading: "加载中...",
        error: "错误",
        save: "保存",
        saveChanges: "保存更改",
        cancel: "取消",
        submit: "提交",
        submitQuestion: "提交问题",
        delete: "删除",
        edit: "编辑",
        view: "查看",
        success: "成功",
        confirmDelete: "确定要删除吗？",
        anonymous: "匿名",
        aStranger: "一位陌生人",
        you: "你",
        questions: "问题",
        copy: "复制",
        copied: "已复制！",
        goBack: "返回",
      },

      // 导航与主题
      nav: {
        home: "首页",
        inbox: "收件箱",
        bottles: "漂流瓶",
        myBoard: "我的留言板",
        settings: "设置",
        signIn: "登录 / 注册",
        signOut: "退出登录",
        theme: "主题",
        themeLight: "浅色",
        themeDark: "深色",
        themeSystem: "跟随系统",
      },

      // 认证
      auth: {
        finalizingSession: "正在完成您的会话...",
      },

      // 首页
      home: {
        title: "momo",
        subtitle: "海洋中的耳语，虚空中的问题。",
        description: "匿名连接，自由表达。",
        createBoard: "创建留言板",
        enterOcean: "进入海洋",
        latestQA: "最新公开问答",
        noQuestions: "暂无公开问题。",
        shareBoard: {
          title: "你的专属留言板",
          description: "分享你的链接，接收来自朋友的匿名提问。",
          copyLink: "复制链接",
          setupPrompt: "你还没有设置你的专属留言板。",
          setupButton: "前往设置",
        },
      },

      // 收件箱
      inbox: {
        title: "我的收件箱",
        stats: "统计",
        total: "全部问题",
        pending: "待回答",
        answered: "已回答",
        private: "私密提问",
        filterAll: "全部",
        filterPending: "待回答",
        filterAnswered: "已回答",
        noQuestions: "你的收件箱是空的。",
        answer: "回答",
        answerModalTitle: "回答问题",
      },

      // 个人主页
      profile: {
        noQuestions: "暂无问题。",
        beFirstToAsk: "来做第一个提问的人吧！",
      },

      // 问题相关
      question: {
        ask: "提个问题",
        placeholder: "想问什么？向 @{{handle}} 提问...",
        private: "私密提问",
        privateHint: "登录后可以私密提问并收到回答通知。",
        privateHintSignIn: "登录",
        privateHintRemainder: "后可以私密提问并收到回答通知。",
        answer: {
          placeholder: "在这里写下你的回答...",
          success: "回答已发布",
          waiting: "等待回答",
          waitingPrompt: "你有一个新问题等待回答。",
        },
        status: {
          answered: "已回答",
          pending: "待回答",
          private: "私密",
        },
        pageTitle: "问题详情",
        notFound: "问题不存在。",
        accessDenied: "你无权查看此问题。",
      },

      // 漂流瓶相关
      bottle: {
        throw: "扔个漂流瓶",
        pick: "捡个漂流瓶",
        release: "放生漂流瓶",
        chat: "与 {{name}} 对话",
        loadError: "无法加载此对话。",
        conversationLabel: "对话",
        conversations: "我的对话",
        noConversations: "暂无对话记录。",
        startConversation: "扔个漂流瓶或捡起一个开始对话吧。",
        throwTitle: "你在想什么？",
        throwDescription: "这条消息将会漂流，等待一位陌生人发现。",
        throwPlaceholder: "在此写下你的消息...",
        castToOcean: "投入大海",
        ocean: {
          title: "耳语之海",
          subtitle: "将思绪投入海中，或寻找属于你的讯息。",
          quietTitle: "大海很平静...",
        },
        message: {
          placeholder: "输入消息...",
          send: "发送",
          sendError: "发送消息失败",
        },
        status: {
          floating: "漂流中",
          picked: "已被捡起",
          replied: "已回复",
        },
      },

      // 设置页面
      settings: {
        title: "个人资料设置",
        displayName: {
          label: "显示名称",
          placeholder: "你的显示名称",
          description: "这是你的公开显示名称。",
        },
        handle: {
          label: "用户名",
          placeholder: "你的唯一用户名",
          description: "这是你的唯一 @用户名，用于你的主页链接。",
        },
        avatar: {
          label: "头像",
          upload: "上传新头像",
          remove: "移除头像",
        },
        saveSuccess: "个人资料更新成功！",
        saveError: "更新个人资料失败。",
        sharePrompt: {
          description: "你的专属留言板已就绪，快分享链接吧！",
          copy: "复制链接",
        },
      },

      // 文件上传
      fileUploader: {
        clickToUpload: "点击上传",
        orDragAndDrop: "或拖拽文件",
        fileTypes: "支持 PNG, JPG, GIF, 最大 {{size}}MB",
      },

      // 错误消息
      errors: {
        userNotFound: "未找到用户 @{{handle}}。",
        api: {
          loadFailed: "加载{{resource}}失败。",
        },
        auth: {
          required: "需要登录",
          denied: "访问被拒绝",
        },
        validation: {
          required: "此字段为必填项",
          minLength: "至少需要 {{count}} 个字符",
          maxLength: "不能超过 {{count}} 个字符",
          invalidHandle: "用户名只能包含字母、数字和下划线。",
          handleTaken: "该用户名已被使用。",
          maxImages: "最多上传 {{count}} 张图片。",
        },
        upload: {
          failed: "上传失败",
          invalidType: "不支持的文件类型",
          tooLarge: "文件过大",
          tooLargeTitle: "文件过大",
          tooLargeDescription: "请上传小于 {{size}}MB 的图片。",
        },
      },

      // 通知消息
      notifications: {
        upload: {
          success: "图片上传成功。",
        },
        question: {
          sent: "问题已发送！",
          sentDescription: "收到回答后会通知你。",
          received: "你收到了一个新问题！",
          answered: "你的问题已得到回答！",
        },
        bottle: {
          thrown: "你的漂流瓶已飘向大海。",
          picked: "你捡到了一个漂流瓶！",
          replied: "对话有新回复。",
          released: "漂流瓶已放生",
          releasedDescription: "它已重返大海。",
        },
      },
    },
  },
};
